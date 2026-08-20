---
title: Devlog: probando un mini framework HTTP con la 2.0-dev1
date: 2026-08-19
author: Equipo CLS
excerpt: Pusimos a prueba la 2.0-dev1 construyendo un mini framework HTTP (router + CRUD de tareas + servidor sobre clshttp.dll). El reporte documenta los bugs del lenguaje que encontramos: records rotos en runtime, stringify(bool/null), break en loops, comparaciones de strings por puntero, y los workarounds que aplicamos para que la app funcionara de extremo a extremo.
tags: [testings, ffi-native, releases, release-dev]
image: /blog/assets/http-test-server-1.png
imageAlt: Captura de la prueba del servidor HTTP de CLS
imageCaption: Prueba del mini framework HTTP sobre la 2.0-dev1 (GET/POST/PUT/DELETE vía sockets).
---

> 🔗 **Repo de la prueba**:
> [github.com/elfrask/mini-laravel-cls-http-server](https://github.com/elfrask/mini-laravel-cls-http-server)

Este devlog es un reporte honesto de una **prueba real de desarrollo** sobre la
**2.0-dev1**: intentamos construir un **mini framework HTTP** (router + CRUD de
tareas + servidor sobre `clshttp.dll`) usando el toolchain `clx`. El resultado
funcionó de extremo a extremo, pero el camino expuso **bugs graves del JIT en
runtime** y limitaciones del lenguaje que es importante conocer si quieres usar
la 2.0-dev1 hoy.

> ⚠️ **Contexto**: el lenguaje no está listo para proyectos grandes. Esta prueba
> es exactamente el tipo de ejercicio que necesitamos para encontrar y corregir
> estos defectos antes de la 2.0 estable.

## Qué intentamos construir

Un servidor HTTP básico con:

- **Router** con path-matching (`GET/POST/PUT/DELETE`).
- **CRUD de tareas** en memoria (crear, listar, actualizar, borrar).
- Servidor sobre **`clshttp.dll`** (extensión FFI nativa).
- Validado contra el **JIT real**, con probes mínimos de reproducción y tests de
  humo vía socket.

## Los bugs del lenguaje en runtime (los más graves)

Todos los probes usan el patrón seguro (`if` con ramas no vacías, condiciones
positivas, comparaciones por `startsWith`/`endsWith`).

| # | Defecto | Síntoma |
|---|---------|---------|
| 2.1 | **Records rotos en runtime** | La escritura por índice se descarta silenciosamente; el estado no persiste |
| 2.2 | **`int` dentro de records/arrays se lee como basura** | IDs, contadores y flags numéricos devuelven valores corruptos |
| 2.3 | **Escribir en un índice de record → crash/basura** | Resultado indefinido al usar records como estado |
| 2.4 | **`break` dentro de loops roto** | La asignación posterior al `break` se pierde si hay un `if` con cuerpo vacío |
| 2.5 | **`!expr` dentro de un `while` roto** | Condiciones negadas no evalúan bien en loops |
| 2.6 | **`x == false` roto** | No se puede comparar contra `false` |
| 2.7 | **`if` con `else` vacía dentro de `while` → asignación perdida** | El flujo salta la asignación |
| 2.8 | **Records parseados con `json.parse` dentro de `while` → valores vacíos** | Acumuladores leídos de JSON en loops se quedan vacíos |
| 2.9 | **`==` compara punteros, no valores de strings** | `"a" == "a"` puede ser `false` |
| 2.10 | **`str()` de un string en un record parseado devuelve un puntero** | Serializar un string leído de JSON da basura |
| 2.11 | **`json.stringify(bool)` devuelve `""`** | Un `PUT` con `{"done":true}` no actualizaba el campo |
| 2.12 | **`str(bool)` devuelve `"1"`/`"0"`** | Imposible distinguir `true` de un valor numérico |
| 2.13 | **`json.stringify(null)` provoca un TRAP** | El handler muere en silencio: el cliente nunca recibe respuesta |
| 2.14 | **`json.parse` inválido provoca TRAP silencioso** | El handler muere sin traza, sin respuesta HTTP |

### Bugs conocidos del lenguaje (resumen)

Estos son los bugs documentados que afectan a la 2.0-dev1 en runtime. Conocerlos
es el primer paso para corregirlos:

- **Records**: la escritura por índice se descarta y los `int` se leen corruptos.
- **`==` de strings**: compara punteros, no valores.
- **`break`, `!` y `== false` dentro de `while`**: rompen la asignación posterior
  y las condiciones negadas.
- **`json.stringify(bool)` y `json.stringify(null)`**: devuelven vacío o matan el
  handler sin traza; `json.parse` inválido también.
- **`clx check` no protege**: valida tipos pero no el comportamiento del JIT; hay
  que ejecutar para detectar estos errores.

## El servidor y la extensión FFI

El DLL de servidor (`clshttp.dll`) hace exactamente lo que se le pide. La raíz de
los problemas al integrarlo estuvo **en el lenguaje**, en la mayoría de los
casos:

- El **TRAP silencioso** (§2.13/2.14) mata el handler sin traza: el servidor
  queda esperando y el cliente nunca recibe respuesta → parece un "cuelgue".
- El runtime **no reporta los traps** (sin log ni código de error): los fallos
  del lenguaje se confunden con fallos del servidor.
- El **primer request tras arrancar** puede recibir un reset de conexión
  (`WSAECONNABORTED`): race entre el arranque de CLS y el listener.
- Un `Content-Length` incorrecto termina en `400` tardío y engañoso (timeout de
  5 s) en vez de un error claro de protocolo.

Sí hubo un defecto real en el DLL — `read_request` descartaba el body cuando
llegaba en el mismo paquete que los headers — que ya está **corregido** en
`lib.rs`: se consumen los bytes sobrantes de `head` como body y solo se `recv` la
diferencia restante.

## Bugs que se desconocían

Durante el desarrollo de esta prueba salieron a la luz bugs del lenguaje que no
estaban documentados ni eran conocidos:

- `==` compara **punteros** de strings, no valores (y `str()` de strings en
  records devuelve punteros).
- Los records tienen **semántica rota en runtime**.
- `break`, `!`, `== false` y `if` con rama vacía son inseguros dentro de `while`.
- `json.stringify(bool)` devuelve `""`, `json.stringify(null)` y `json.parse`
  inválido provocan un **TRAP silencioso**.
- **No hay mecanismo para que un TRAP del JIT se reporte** (log, excepción,
  código de error): los fallos parecen "cuelgues" del servidor.

## Resumen

1. **El mayor riesgo del lenguaje es el JIT runtime**: records, `break`,
   negación, `==` de strings, `json.stringify` (bool/null) y `json.parse`
   inválido generan **corrupción silenciosa o traps sin traza**.
2. **`clx check` no protege**: valida tipos pero no el comportamiento del JIT.
3. El servidor hace lo que se le pide; los "cuelgues" y fallos de integración
   tenían su raíz en los traps silenciosos del lenguaje y en la falta de reporte
   de errores del runtime (el único defecto real del DLL, el body perdido, ya
   está corregido).
4. **Estado final**: la app CRUD de tareas funciona de extremo a extremo por
   HTTP (GET/POST/PUT/DELETE/404/validaciones) tras la reescritura del estado
   sin records, la extracción de campos sin `json.parse` y el fix del body en
   el DLL.

Este tipo de pruebas es exactamente lo que nos permite avanzar el roadmap hacia
la 2.0 estable. Cada bug encontrado aquí es un item más para corregir en las
próximas entregas.