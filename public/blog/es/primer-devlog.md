# Primer devlog: CLS 2.0 y el nuevo sitio

*Publicado el 2026-08-08 por Equipo CLS*

Bienvenidos al blog de CLS. Este es el espacio donde contaremos los avances del
lenguaje, los detalles de cada release y los tutoriales que nos van pidiendo.

## Qué es CLS

CLS es un lenguaje de programación de **propósito general**: fácil de usar,
modular y ligero. Multiplataforma por naturaleza y compilado a binario nativo,
está pensado para scripting, plugins, herramientas CLI y aplicaciones de todo tipo.

> Este devlog es la primera entrada. El contenido irá evolucionando con el
> proyecto.

## Qué trae CLS 2.0

La versión 2.0 marca el rumbo hacia la compilación a **binario nativo**, dejando
atrás la orientación exclusiva a WebAssembly. WASM queda como backend portable,
pero el objetivo es que `clx build` produzca ejecutables nativos para cada
plataforma y arquitectura.

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
