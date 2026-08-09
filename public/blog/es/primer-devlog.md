# Primer devlog: CLS 2.0 y el nuevo sitio

*Publicado el 2026-08-08 por Equipo CLS*

Bienvenidos al blog de CLS. Este es el espacio donde contaremos los avances del
lenguaje, los detalles de cada release y los tutoriales que nos van pidiendo.

## Qué es CLS

CLS es un lenguaje de programación de **propósito general**: fácil de usar,
modular y ligero. Multiplataforma por naturaleza y compilado a binario nativo,
está pensado para scripting, plugins, herramientas CLI y aplicaciones de todo tipo.

## De dónde venimos: 1.0–1.1 y 1.2

Antes de la 2.0, el lenguaje pasó por dos etapas que conviene recordar:

- **1.0–1.1** (junio 2025): la primera versión oficial y numerada del lenguaje,
  escrita en Python. Era un
  transpilador que generaba código Python y lo ejecutaba con `exec()`. Muy
  completo en sintaxis (módulos, clases, CMX, stdlib...), pero con **tiempos de
  compilación muy grandes** incluso en archivos pequeños. Aunque fue la
  primera versión "pública", no fue la primera implementación: antes hubo
  prototipos en [Batch](/blog/devlog-origenes-batch), las primeras
  [implementaciones en Python](/blog/devlog-primeras-python) y un motor en
  [JavaScript](/blog/devlog-clsjs). Contamos su historia
  en [el devlog de la 1.0–1.1](/blog/devlog-1-0-1-1).
- **1.2** (noviembre 2025): un intento de reescritura **desde cero en Cython**
  para atacar el rendimiento. Se construyó un frontend completo (lexer, parser y
  estructuración con tipos C estáticos), pero **nunca llegó a tener evaluador**:
  el proyecto se detuvo por los problemas de **portabilidad** que imponía
  Cython (binarios atados a plataforma y arquitectura, difíciles de distribuir
  multiplataforma). Lo detallamos en
  [el devlog de la 1.2](/blog/devlog-1-2).

La 2.0 nace de esa historia: conserva la ambición de la 1.0–1.1, toma la
lección de la 1.2 (valía la pena empezar de cero) y corrige lo que faltaba en
ambas.

## Qué trae CLS 2.0

La versión 2.0 es una reimplementación completa en **Rust**, y el cambio más
grande es el rumbo: de la orientación exclusiva a WebAssembly pasamos a la
compilación a **binario nativo**, dejando WASM como backend portable.

### Frente a la 1.0–1.1 (Python)

- **Ejecución**: la 1.0–1.1 transpilaba a Python y verificaba tipos en runtime.
  La 2.0 compila a **binario nativo** para cada plataforma y arquitectura
  (Windows, Linux, macOS), sin depender de Python.
- **Tipos**: ahora hay verificación de tipos **estática**, TypeScript-style,
  con uniones (`alias Color = "red" | "green"`), genéricos, literal types,
  tuplas y records. Muchos errores se detectan en compilación y no en ejecución.
- **Módulos**: la 1.0–1.1 usaba `import`/`include` sobre archivos sueltos. La
  2.0 introduce **`.clslib`** (librerías compiladas) con verificación de tipos
  multi-módulo.
- **Rendimiento**: el pipeline nuevo (`lexer → parser → type checker →
  optimizer → backends`) ataca de raíz el problema de los tiempos de
  compilación que motivó la 1.2.

### Frente a la 1.2 (Cython)

- **Completo**: la 1.2 quedó en el frontend, sin ejecución. La 2.0 construye el
  pipeline completo: frontend **+ type checker + optimizer + backends** (nativo,
  tree-walker, JSON y WASM).
- **Backend nativo**: mientras la 1.2 solo tokenizaba y estructuraba, la 2.0 ya
  emite ejecutables nativos y cuenta con un runtime (`cls-runtime`) con VFS y
  sandbox, y nodos host (`clx` para desarrollo y `clxr` ligero).

### Novedades que no existían en 1.x

- **CMX nativo**: el marcado tipo JSX de la 1.0–1.1 ahora es `CmxValue`, un tipo
  de primera clase del lenguaje.
- **FFI e interoperabilidad**: embebible desde Rust, Python, JS, Go, C# y más.
- **WASM como backend portable** y JIT opcional (`clx run --jit`).
- **JIT (CLS → WASM → wasmtime)** como ruta experimental.
- **LSP + extensión de VS Code + type maps**, y mejoras de DX como
  `async`/`await` y errores con trace.

Algunos hitos del roadmap:

- Pipeline `lexer → parser → type checker → optimizer`.
- Backends: tree-walker, JSON, WASM y nativo.
- Sistema de módulos con `.clslib` y verificación multi-módulo.
- FFI e interoperabilidad con código nativo.

## El nuevo sitio

La web se reescribió con Next.js App Router, i18n en español e inglés y
generación estática. Las descargas ahora se sirven desde URLs propias
(`/download/release/cls-2.0.0-<plataforma>-<arquitectura>.<ext>`), alimentadas
por datos versionados, y dejamos de apuntar a los releases de GitHub.

En esta primera entrega también estrenamos secciones de **Blog** y **Showcase**.

## Lo que viene

- Más devlogs sobre el backend nativo.
- Tutoriales de scripting, plugins y CMX.
- Guías de contribución para el repositorio.

¡Nos vemos en el próximo devlog!
