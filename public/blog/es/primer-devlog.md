# Anuncio: CLS 2.X, el camino que estamos construyendo

*Publicado el 2026-08-12 por Equipo CLS*

Hoy anunciamos el rumbo de la próxima generación de CLS: la serie **2.X**. Es
la etapa más ambiciosa del lenguaje hasta ahora: una reescritura completa
**en Rust**, con **tipado estático** y un **intérprete JIT** como base.

> **Estado actual**: CLS 2.X sigue en desarrollo y no tiene fecha de release.
> Estamos cerrando las evaluaciones de QA antes de publicar la primera versión
> estable de la serie. Te contamos el estado exacto en el
> [anuncio de la 2.0-dev1](/blog/anuncio-estado-2-0-dev1).

## El rumbo de la 2.X

La serie 2.X arranca de una pregunta que veníamos arrastrando desde las
versiones anteriores: ¿cómo hacemos un CLS **rápido** sin sacrificar lo que lo
hace especial — correr en todas partes?

- La **1.0–1.1** transpilaba a Python y resolvía la portabilidad, pero con
  tiempos de compilación muy grandes.
- La **1.2** probó reescribirlo en Cython y logró rendimiento, pero quedó
  atada a plataforma y arquitectura, y nunca llegó a tener ejecución.

La 2.X toma lo mejor de ambas: la ambición de la 1.0–1.1, la lección de la 1.2
(partir de cero vale la pena) y una respuesta nueva para la portabilidad.

## Qué trae

- **Reescritura en Rust**, con un pipeline `lexer → parser → type checker →
  optimizer → backends`.
- **Tipado estático** TypeScript-style, con uniones, genéricos, literal types,
  tuplas y records.
- **Intérprete JIT** como ruta de ejecución.
- **Backends**: tree-walker, JSON, WASM (portable) y compilación a binario
  nativo.
- **Sistema de módulos** con `.clslib` y verificación multi-módulo.
- **FFI e interoperabilidad**: embebible desde Rust, Python, JS, Go, C# y más.

## Cómo está avanzando

La serie 2.X avanza sobre la base del intérprete JIT. En el
[anuncio de la 2.0-dev1](/blog/anuncio-estado-2-0-dev1) contamos dónde está el
desarrollo exactamente: el lenguaje está ~90% listo y la primera versión
llegará con el intérprete JIT antes de la versión con el compilador.

## Lo que viene

- Concluir las evaluaciones de QA y publicar la primera versión de la 2.X.
- Más devlogs sobre los backends: el JIT, el nativo y WASM.
- Tutoriales de scripting, plugins y CMX.
- Guías de contribución para el repositorio.

Iremos contando el avance en el blog. Gracias por acompañar el camino hacia la
2.X.