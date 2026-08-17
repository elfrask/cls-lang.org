# Anuncio: el roadmap de CLS hacia la 2.2

*Publicado el 2026-08-17 por Equipo CLS*

> **En resumen**: la 2.0 ya tiene un **intérprete JIT** que consigue velocidades
> similares a C++/Rust en algunas tareas y a JavaScript en otras. Este anuncio
> aclara el **roadmap** completo hacia la 2.2, etapa por etapa.
>
> ⚠️ **Importante**: el estado actual del proyecto **no es apto para usarse en
> proyectos grandes**. Es ideal para automatizaciones, aplicaciones medianas y
> experimentación.

## Qué tiene CLS hoy (2.0)

La 2.0 ya publicada incluye:

- **Intérprete Just-In-Time (JIT)**: CLS → WASM → wasmtime.
- Velocidades **similares a C++ y Rust** en algunas tareas y **a JavaScript** en
  otras (ver el [anuncio del estado de la 2.0-dev1](/blog/anuncio-estado-2-0-dev1)).
- Reescritura completa en Rust, tipado estático, OOP, CMX y bindings C/Python/JS.
- Binarios y extensiones de VS Code ya disponibles en las [descargas](/download).

## Roadmap de la 2.0

- **Optimizaciones para el manejo de strings**: evadir clonaciones de cadenas en
  cada operación.
- **Correcciones del REPL**: se irán revisando los fallos graves.
- **Feedback activo**: reportes sobre fallos durante la compilación, fugas de
  rendimiento y más.
- **Empaquetado `.clsapp`**: compilación para empaquetar aplicaciones.
- **Garbage Collector de estrategia activa**: para gestionar la memoria en el
  runtime. Se podrá **deshabilitar** para lograr mejor rendimiento, gestionando
  la memoria con deletes manuales.
- **Registry**: para que la comunidad pueda subir sus propios módulos.
- **Funciones asíncronas**: bucles de eventos en múltiples hilos.
- **Internals modules**: se irán alimentando para mayor variedad de usabilidad.

## Roadmap de la 2.1

- **Soporte para `.clslib`**: bibliotecas del lenguaje.
- **Optimización de extensiones con código nativo de C** (una optimización
  completa requerirá del compilador AOT).
- **Más extensiones para múltiples lenguajes**: actualmente solo C, pero se
  agregará soporte para Rust, Fortran, ASM, Python y JavaScript (los dos últimos
  pueden requerir módulos opcionales).
- **SDKs más robustas** para los bindings.

## Roadmap de la 2.2

- **Compilador AOT binario**: para generar binarios que se ejecuten en el
  sistema y binarios para **bare metal** (sin sistema).
- **Optimizador de internals**: binarios más pequeños, incluyendo solo lo
  necesario.
- **Garbage Collector por estrategia de escape** para la compilación AOT.
- **Extensiones nativas** para eliminar el overhead de conversión.
- **Optimización para circuitos embebidos**: binarios destinados a dispositivos.
- **Mecanismos y sentencias de bajo nivel**: para control absoluto sobre la
  memoria.

## Estado actual: honestidad ante todo

El proyecto **no está listo para producción en proyectos grandes**. Hoy es ideal
para:

- **Automatizaciones** y scripts.
- **Aplicaciones medianas**.
- Experimentación y prototipado.

Cada etapa del roadmap nos acerca a un lenguaje apto para proyectos cada vez más
ambiciosos. Gracias por acompañar el camino hacia la 2.2.