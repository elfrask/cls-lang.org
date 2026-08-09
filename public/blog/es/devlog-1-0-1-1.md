# Devlog: CLS 1.0–1.1, el origen del lenguaje

*Publicado el 2025-06-10 por Equipo CLS*

Esta es la primera entrada de la serie. Hoy vamos a mirar hacia atrás: a las
versiones 1.0 y 1.1, donde todo empezó. CLS nació como un lenguaje hobby, pero
poco a poco se convirtió en el proyecto más ambicioso de su autor.

## El punto de partida

CLS comenzó como un proyecto personal, escrito **en Python**. El propio README
de esa época lo decía: *"it is a programming language created for me as hobby in
his startings. but with the time this be convert in my project more ambitious"*.
El arranque del CLI lo resumía bien: *"Cls 1.1.1 - Build for win32 platforms,
CLS 2016-2025"*, bajo la marca *Vinestar Studio*.

## Cómo funcionaba el motor

La versión 1.0–1.1 no era un intérprete clásico: era un **transpilador que
generaba código Python y lo ejecutaba con `exec()`**. Todo el motor vivía en un
solo archivo de unas 3600 líneas (`clsengine.py`) con una pipeline de seis
etapas:

1. `desline` — el lexer, que lee carácter a carácter.
2. `parselex` — agrupa `()`, `[]` y `{}`.
3. `estructuration` — reconoce cada tipo de sentencia del lenguaje.
4. `generator` — emite el código Python equivalente.
5. `jump` — une todo con la indentación correcta.
6. `exec` — ejecuta el Python generado.

Las variables CLS se renombraban con el prefijo `var_` para no chocar con el
código generado, y la verificación de tipos se hacía en tiempo de ejecución.

## El lenguaje en 1.0–1.1

Ya en esta versión el lenguaje era sorprendentemente completo. Un vistazo a
`test.scls` muestra la mayoría de las características:

- Funciones tipadas con retorno: `function holabb() -> str`.
- Lambdas: `var FA = (xd) -> String { return xd + xd + xd; };`.
- `if` / `elif` / `else` y hasta **if-expressions**:
  `print(if (ask == "s") then ("es verdadero") else ("no es verdadero"))`.
- `switch` / `case` / `case default`, `while`, `for`, `for each` y `with`.
- `try` / `catch` para manejo de errores.
- **POO**: clases con constructor `function main()` (mapeado a `__init__`),
  `me` como `this`, herencia y visibilidad (`export`, `static`, `private`,
  `public`, `global`).
- `struct` con campos tipados y acceso por punto.
- `namespace` y módulos anidados:
  `module useModules { ... }; useModules.subModule.hi()`.
- `import` / `from` / `include` y plantillas (`template`).
- Arrays con métodos (`forEach`, `map`, `filter`, `push`) y diccionarios.
- Tipos especiales como `char`, `intbit` (enteros por bits), `hex`/`bin`/`oct`,
  booleanos (`true`/`false`/`on`/`off`) y `Promise` con `.then()` y `.catch()`.

Y por supuesto **CMX**, el marcado tipo JSX que sigue siendo parte de la
identidad del lenguaje:

```clsx
hola = <div>Hola mundo!</div>;
```

La biblioteca estándar ya cubría bastante: módulos `fs` (archivos, directorios,
lectura/escritura async con threads), `os` (procesos, variables de entorno) y
`http` con peticiones y promesas. Incluso tenía un huevo de pascua en la tabla
de códigos: el `418 im_a_teapot`.

## Los experimentos alrededor

La 1.0–1.1 fue también una época de muchos experimentos:

- **Casm**: un lenguaje tipo ensamblador con su propia VM de memoria lineal, que
  compilaba a `.cobj` o JSON.
- **CLSJS**: un puerto del motor completo a JavaScript (~2600 líneas), con su
  propio servidor y ejecución en el navegador.
- **Godot**: un transpilador de CLS a GDScript, con un juego de ejemplo.
- **CPKG**: un gestor de paquetes con cuenta de desarrollador y plantillas.
- **Brython**: experimentos para correr CLS directamente en la web.

## El problema

Con todo ese alcance, había un problema que se hacía cada vez más evidente:
**los tiempos de compilación eran muy grandes, incluso con archivos no muy
grandes**. Transpilar a Python y ejecutarlo con `exec()` no era un camino
rápido.

Esa fue la motivación para intentar una reescritura desde cero. Lo contamos en
el siguiente devlog.

---

*Versiones: [CLS 1.0–1.1](https://github.com/elfrask/cls/tree/1.0-1.1) · Siguiente:
[CLS 1.2, la reescritura en Cython](/blog/devlog-1-2).*
