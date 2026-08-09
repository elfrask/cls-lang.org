# Devlog: CLS 1.2, the rewrite in Cython

*Published on 2025-11-20 by the CLS Team*

In the previous devlog we saw the origin of CLS in the 1.0–1.1: a transpiler to
Python that was very complete but had a serious performance problem. This is
the story of the attempt to fix it.

## The problem we wanted to solve

The 1.0–1.1 engine transpiled to Python and executed with `exec()`, and that
translated into **long compile times even with not-very-large files**. The
solution that was proposed was drastic: rewrite CLS **from scratch**.

> *"The 1.2 version of CLS is being developed from 0 to deal with the big
> compile times even with not-very-large files, soon the first release
> candidate for 1.2 will be available"*

## The bet: Cython

The rewrite was done in **Cython**: `cdef` classes everywhere, `.pxd` files as
C headers, typed lists and native compilation with MSVC and a compiler cache
(`sccache`). The idea was that, by moving the whole frontend to compiled code,
CLS compilation would stop being a bottleneck.

## The new pipeline

Instead of a monolith, the 1.2 organized the work into packages inside
`clslang/` (`compiler/`, `tokenizer/`, `workspace/`, `libs/`). The entry point
was `ClsCompiler.Compile()`, with four stages:

1. `_tokenizer` — the lexer, which now detected multichar operators (`++`, `--`,
   `//`, `**`, `!=`, `||`, `==`, `<<`, `>>`, `->`) and comments with `//` and `#`.
2. `_parsing` — matched `()`, `[]`, `{}` and built the `NodeToken` tree.
3. `_structureSentence` — recognized statements; it even restructured C-style
   functions (`ReturnType nombre(params) { }`) into the canonical form
   `function nombre(params) -> ReturnType { }`.
4. `_structureExpression` — handled typed arrow functions.

The "bytecode" of the 1.2 was the token tree itself: `ClsBlock` stored the
`ByteCodeScript` and `getCode()` returned it without executing anything.

## New syntax

The 1.2 was also preparing syntax changes. The example file `main.ccls` showed
what was planned:

- Functions with C-style typing: `int main(saludo) { ... }`.
- **`loop`**, a new infinite loop.
- **`interface`** (only signatures for editors) and **`structure`** (real
  memory), replacing the 1.0's `struct`:
  `interface Persona() { name: String = "", ages: Integer = 18, ... }`.
- **`for each Elemento and Index in (array)`**, with index.
- Type acronyms: `int`, `str`, `float`, `i32`/`i64`/`i16`/`i8`, `bool`, `cmx`,
  `fun`, `any`/`unknown`, `null`, `Empty`.
- Generics and compound types: `Record<String, i32>`, `String{Integer}`.
- `with` with a syntax different from the 1.0's.

## Halfway there

The 1.2 ended up having a fairly complete frontend, but **it was never
finished**:

- There was no evaluator or code generator: the `execute()` function was
  literally `pass`, and nothing executed the programs.
- The build scripts (`build.cmd`/`export.cmd`) pointed to a `setup.py` that did
  not exist.
- There were recognizable bugs in the code: a typo that overwrote
  `AnonymousFunction` with `AsyncFunction`, an `IndexError` in the `module`
  case, and a `class` pattern that never matched.
- The REPL inherited from the 1.0–1.1 was left broken because it referenced
  modules that no longer existed in the new engine.

But what finally sank the project was not just what was left to write: it was a
deep problem with the technology chosen.

## The portability problem

The rewrite in **Cython** solved performance, but it hit something that was
always central to CLS: **portability**. An engine compiled with Cython is tied
to the architecture it was compiled for — the binary is built and linked for a
specific platform and processor, and moving it to another system requires
recompiling everything from scratch, with its whole chain of native
dependencies. In other words: a Windows `.so`/`.pyd` is useless on Linux, an
x86_64 binary is useless on ARM, and keeping support for several platforms at
once became a huge task.

That was a serious problem for a language that by design wanted to be
**multiplatform by nature**. The 1.0–1.1, with its Python transpiler, ran
anywhere Python existed; the 1.2 in Cython was condemning itself to being a
one-machine-at-a-time language, and every multiplatform distribution demanded a
native compilation ecosystem (MSVC, GCC, the `sccache` cache, the `setup.py`...)
that in the end never got completed.

The lesson was clear: the path to a fast CLS could not sacrifice what made the
language special — running everywhere. That was, ultimately, the reason the 1.2
was stopped.

## The next step

The rewrite in Cython proved that starting from zero was worth it, but the path
to a complete runtime was still enormous. And the final decision was to start
again once more, this time in **Rust**, with a broader vision: not just a fast
frontend, but a complete pipeline all the way to the **native binary** for each
platform and architecture — Windows, Linux and macOS — that would solve the
portability Cython left unanswered. That is what we now know as CLS 2.0, and we
tell it in [the 2.0's first devlog](/blog/primer-devlog).

---

*Version: [CLS 1.2](https://github.com/elfrask/cls/tree/1.2).*
