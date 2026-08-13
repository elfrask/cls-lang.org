# Anuncio: el estado actual de CLS 2.0-dev1

*Publicado el 2026-08-13 por Equipo CLS*

Hoy queremos contarles exactamente dónde está la próxima generación de CLS.
Venimos trabajando en la **2.0** — una reescritura completa en Rust con tipado
estático e intérprete JIT — y estamos en la recta final hacia la primera
versión estable.

> **Estado actual**: el lenguaje está **~90% listo**. La **2.0-dev1** está
> pasando por estrictas evaluaciones de QA antes de que publiquemos los
> primeros binarios públicos. Aún no hay descargas disponibles.

## Qué es la serie 2.0

La 2.0 es la etapa más ambiciosa del lenguaje hasta ahora: una reescritura
completa en **Rust** con **tipado estático**, un pipeline de tipo
`lexer → parser → type checker → optimizer → backends` y un **intérprete
Just-In-Time (JIT)** como ruta de ejecución principal.

## El intérprete JIT

El hito que estamos a punto de entregar es el intérprete **JIT**. Es la pieza
que cambia las reglas absolutas del rendimiento en CLS:

- Promete velocidades del orden de **×8000** frente a las versiones anteriores
  del intérprete.
- En nuestras evaluaciones internas queda **muy cerca del rendimiento nativo**.

Con este intérprete, la primera versión estable correrá programas con una
fracción del overhead que sufrían las versiones 1.x.

## Solo JIT primero, el compilador después

Una decisión importante de esta etapa: **la primera versión de la serie 2.0 se
publicará solo con el intérprete JIT**. El compilador (compilación a binario
nativo) llegará en una versión posterior, sobre el mismo cimiento.

Esto nos permite validar en producción la base del lenguaje — tipado, módulos,
FFI y el propio JIT — antes de sumar la capa de compilación.

## Evaluación de QA

La 2.0-dev1 está pasando por evaluaciones de QA estrictas y de calidad. En
esas pruebas venimos encontrando y corrigiendo problemas de la implementación
actual de la serie 2.0 (que aún no compila por completo desde el árbol de
trabajo), mientras el JIT ya muestra resultados contundentes en las pruebas de
rendimiento.

La publicación de los binarios públicos llegará cuando la evaluación de QA dé
luz verde.

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

## Lo que viene

- Concluir las evaluaciones de QA y publicar la **2.0** con el intérprete JIT.
- Más devlogs sobre los backends: el JIT, el nativo y WASM.
- Tutoriales de scripting, plugins y CMX.
- Guías de contribución para el repositorio.

Iremos contando el avance en el blog. Gracias por acompañar el camino hacia la
2.0.