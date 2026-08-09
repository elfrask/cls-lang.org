# Devlog: CLS 1.2, la reescritura en Cython

*Publicado el 2025-11-20 por Equipo CLS*

En el devlog anterior vimos el origen de CLS en la 1.0–1.1: un transpilador a
Python muy completo pero con un problema serio de rendimiento. Esta es la
historia del intento de arreglarlo.

## El problema que queríamos resolver

El motor de la 1.0–1.1 transpilaba a Python y ejecutaba con `exec()`, y eso se
traducía en **grandes tiempos de compilación incluso con archivos no muy
grandes**. La solución que se planteó fue drástica: reescribir CLS **desde
cero**.

> *"Se esta en el desarrollo de la version 1.2 de CLS que se esta haciendo de 0
> para tratar los grandes tiempos de compilación incluso con archivos no muy
> grandes, proximamente estara disponible el primer candidato de lanzamiento
> para la 1.2"*

## La apuesta: Cython

La reescritura se hizo en **Cython**: clases `cdef` por todas partes, archivos
`.pxd` como cabeceras C, listas tipadas y compilación nativa con MSVC y caché de
compilador (`sccache`). La idea era que, al mover todo el frontend a código
compilado, la compilación de CLS dejara de ser un cuello de botella.

## El pipeline nuevo

En lugar de un monolito, la 1.2 organizó el trabajo en paquetes dentro de
`clslang/` (`compiler/`, `tokenizer/`, `workspace/`, `libs/`). El punto de
entrada era `ClsCompiler.Compile()`, con cuatro etapas:

1. `_tokenizer` — el lexer, que ahora detectaba operadores multichar (`++`, `--`,
   `//`, `**`, `!=`, `||`, `==`, `<<`, `>>`, `->`) y comentarios con `//` y `#`.
2. `_parsing` — emparejaba `()`, `[]`, `{}` y construía el árbol de `NodeToken`.
3. `_structureSentence` — reconocía sentencias; incluso reestructuraba
   funciones estilo C (`ReturnType nombre(params) { }`) a la forma canónica
   `function nombre(params) -> ReturnType { }`.
4. `_structureExpression` — manejaba funciones flecha tipadas.

El "bytecode" de la 1.2 era el propio árbol de tokens: `ClsBlock` guardaba el
`ByteCodeScript` y `getCode()` lo devolvía sin ejecutar nada.

## Sintaxis nueva

La 1.2 también preparaba cambios de sintaxis. El archivo de ejemplo `main.ccls`
mostraba lo que estaba planeado:

- Funciones con tipado estilo C: `int main(saludo) { ... }`.
- **`loop`**, un ciclo infinito nuevo.
- **`interface`** (solo firmas para los editores) y **`structure`** (memoria
  real), reemplazando al `struct` de la 1.0:
  `interface Persona() { name: String = "", ages: Integer = 18, ... }`.
- **`for each Elemento and Index in (array)`**, con índice.
- Acrónimos de tipos: `int`, `str`, `float`, `i32`/`i64`/`i16`/`i8`, `bool`,
  `cmx`, `fun`, `any`/`unknown`, `null`, `Empty`.
- Genéricos y tipos compuestos: `Record<String, i32>`, `String{Integer}`.
- `with` con una sintaxis distinta a la de la 1.0.

## A mitad de camino

La 1.2 llegó a tener un frontend bastante completo, pero **nunca se terminó**:

- No existía evaluador ni generador de código: la función `execute()` era
  literalmente `pass`, y nada ejecutaba los programas.
- Los scripts de build (`build.cmd`/`export.cmd`) apuntaban a `setup.py` que no
  existía.
- Había bugs reconocibles en el código: un typo que pisaba `AnonymousFunction`
  con `AsyncFunction`, un `IndexError` en el caso `module`, y un patrón de
  `class` que nunca coincidía.
- El REPL heredado de la 1.0–1.1 quedó roto porque referenciaba módulos que ya
  no existían en el motor nuevo.

## El siguiente paso

La reescritura en Cython demostró que valía la pena partir de cero, pero el
camino hacia un runtime completo seguía siendo enorme. La decisión final fue
empezar de nuevo una vez más, esta vez en **Rust**, con una visión más amplia:
no solo un frontend rápido, sino un pipeline completo hasta el binario nativo.
Eso es lo que hoy conocemos como CLS 2.0, y lo contamos en
[el primer devlog de la 2.0](/blog/primer-devlog).

---

*Versión: [CLS 1.2](https://github.com/elfrask/cls/tree/1.2) · Anterior:
[CLS 1.0–1.1, el origen del lenguaje](/blog/devlog-1-0-1-1).*
