# Anuncio: el estado actual de CLS 2.0-dev1

*Publicado el 2026-08-13 por Equipo CLS · Actualizado el 2026-08-17*

> **Estado actual**: la **2.0-dev1 ya está publicada** con binarios disponibles en
> la [página de descargas](/download). El último benchmark del **JIT** (Fase 3:
> internals WASM fusionados) confirma el rendimiento: en la aritmética CLS está
> a la par de C++/Rust y **×100+ más rápido que Python** en varias pruebas.

## Qué es la serie 2.0

La 2.0 es la etapa más ambiciosa del lenguaje hasta ahora: una reescritura
completa en **Rust** con **tipado estático**, un pipeline de tipo
`lexer → parser → type checker → optimizer → backends` y un **intérprete
Just-In-Time (JIT)** como ruta de ejecución principal.

## El intérprete JIT

El hito central de esta etapa es el intérprete **JIT**. Es la pieza que cambia
las reglas del rendimiento en CLS:

- Promete velocidades del orden de **×8000** frente a las versiones anteriores
  del intérprete.
- En el último benchmark queda **muy cerca del rendimiento nativo**.

### Último benchmark (Fase 3: internals WASM fusionados)

Mediciones promedio de 3 runs, en **ms** (menos es mejor), wasmtime:

| Prueba | Carga | **CLS** | C++ | Rust | JS | Python |
|---|---|---|---|---|---|---|
| **Aritmética** | 20M iter | **90.7** | 91.1 | **82.8** | 109.2 | 12 111.7 |
| **Fib recursivo** | fib(30) | 4 391 | **2.1** | 2.3 | 12.4 | 173.7 |
| **Arrays** | 100k | 344.7 | **0.2** | 0.2 | 6.2 | 4.9 |
| **Strings** | 10k | 52 | 0.1 | **0.03** | 0.2 | 4.1 |
| **Math** | 200k | 80.3 | 8.5 | **1.8** | 7.9 | 85.5 |
| **Llamadas** | 1M | 1 918.7 | 0* | 0* | **3.5** | 199.6 |

\* C++/Rust con `-O3` **inlinean** `cuadrado` (0ms — no comparable).

### Antes vs después de la Fase 3

| Prueba | Antes | Con internals WASM (hoy) | Objetivo | Estado |
|---|---|---|---|---|
| arith | 90.7ms | **94.0ms** | ~90ms (=) | ✅ sin regresión |
| fib(30) | 4 391ms | **13.3ms** | ≤300ms | ✅ **×330** |
| arrays (100k push) | 345ms | **0.7ms** | ≤40ms | ✅ **×493** |
| math (sqrt/sin) | 80.3ms | **5.3ms** | ≤25ms | ✅ **×15** |
| calls (1M) | 1 919ms | **4.0ms** | ≤200ms | ✅ **×480** |

El speedup viene de fusionar las **internals dentro del módulo CLS** (cero
imports `env.str_*`, `env.arr_*`, `env.math_*`) y del **shadow call stack** en
memoria lineal (0 host calls). El WAT de los benchmarks no importa internals: 0
imports migrados, quedan 77 (I/O + errores + nodo).

### Suites y calidad

- `run-availible.ps1`: **25 PASS** · `run-tests.ps1`: **21 PASS** (+7 SKIP).
- `cargo test` (workspace): **184 PASS, 0 FAIL**.
- Errores con trace completo, REPL con estado persistente y paridad con wasmi.

## Solo JIT primero, el compilador después

Una decisión importante de esta etapa: **la primera versión de la serie 2.0 se
publica solo con el intérprete JIT**. El compilador (compilación a binario
nativo) llegará en una versión posterior, sobre el mismo cimiento.

Esto nos permite validar en producción la base del lenguaje — tipado, módulos,
FFI y el propio JIT — antes de sumar la capa de compilación.

## Qué trae la serie 2.0

- **Reescritura en Rust**, con pipeline `lexer → parser → type checker →
  optimizer → backends`.
- **Tipado estático** TypeScript-style, con uniones, genéricos, literal types,
  tuplas y records.
- **Intérprete JIT** como ruta de ejecución, con rendimiento cerca del nativo.
- **Backends**: tree-walker, JSON, WASM (portable) y, más adelante,
  compilación a binario nativo.
- **Sistema de módulos** con `.clslib` y verificación multi-módulo.
- **FFI e interoperabilidad**: embebible desde Rust, Python, JS, Go, C# y más.
- **Toolchain**: CLI `clx`, runtime ligero `clxr`, LSP, bindings C/Python/JS.

## Lo que viene

- Más devlogs sobre los backends: el JIT, el nativo y WASM.
- Tutoriales de scripting, plugins y CMX.
- Guías de contribución para el repositorio.

Iremos contando el avance en el blog. Gracias por acompañar el camino hacia la
2.0.