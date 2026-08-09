# First devlog: CLS 2.0 and the new site

*Published on 2026-08-08 by the CLS Team*

Welcome to the CLS blog. This is the space where we'll tell the language's
progress, the details of each release and the tutorials you keep asking for.

## What CLS is

CLS is a **general-purpose** programming language: easy to use, modular and
light. Multiplatform by nature and compiled to native binaries, it's designed
for scripting, plugins, CLI tools and all kinds of applications.

## Where we come from: 1.0–1.1 and 1.2

Before 2.0, the language went through two stages worth remembering:

- **1.0–1.1** (June 2025): the first official and numbered version of the
  language, written in Python. It was a transpiler that generated Python code
  and executed it with `exec()`. Very complete in syntax (modules, classes,
  CMX, stdlib...), but with **very long compile times** even on small files.
  Although it was the first "public" version, it wasn't the first
  implementation: before it there were prototypes in [Batch](/blog/devlog-origenes-batch),
  the first [implementations in Python](/blog/devlog-primeras-python) and an
  engine in [JavaScript](/blog/devlog-clsjs). We tell its history in [the
  1.0–1.1 devlog](/blog/devlog-1-0-1-1).
- **1.2** (November 2025): an attempt at a **from-scratch rewrite in Cython**
  to attack performance. A complete frontend was built (lexer, parser and
  structuring with static C types), but **it never got an evaluator**: the
  project was stopped by the **portability** problems Cython imposed (binaries
  tied to platform and architecture, hard to distribute multiplatform). We
  detail it in [the 1.2 devlog](/blog/devlog-1-2).

The 2.0 is born from that history: it keeps the ambition of the 1.0–1.1, takes
the lesson of the 1.2 (starting from scratch was worth it) and fixes what was
missing in both.

## What CLS 2.0 brings

Version 2.0 is a complete reimplementation in **Rust**, and the biggest change
is the direction: from a WebAssembly-only focus we moved to compiling to
**native binaries**, leaving WASM as a portable backend.

### Compared to the 1.0–1.1 (Python)

- **Execution**: the 1.0–1.1 transpiled to Python and checked types at
  runtime. The 2.0 compiles to a **native binary** for each platform and
  architecture (Windows, Linux, macOS), without depending on Python.
- **Types**: now there's **static** type checking, TypeScript-style, with
  unions (`alias Color = "red" | "green"`), generics, literal types, tuples and
  records. Many errors are detected at compile time instead of runtime.
- **Modules**: the 1.0–1.1 used `import`/`include` over loose files. The 2.0
  introduces **`.clslib`** (compiled libraries) with multi-module type
  checking.
- **Performance**: the new pipeline (`lexer → parser → type checker →
  optimizer → backends`) attacks at its root the compile-time problem that
  motivated the 1.2.

### Compared to the 1.2 (Cython)

- **Complete**: the 1.2 stayed in the frontend, without execution. The 2.0
  builds the full pipeline: frontend **+ type checker + optimizer + backends**
  (native, tree-walker, JSON and WASM).
- **Native backend**: while the 1.2 only tokenized and structured, the 2.0
  already emits native executables and has a runtime (`cls-runtime`) with VFS
  and sandbox, and host nodes (`clx` for development and `clxr` lightweight).

### New things that didn't exist in 1.x

- **Native CMX**: the JSX-like markup of the 1.0–1.1 is now `CmxValue`, a
  first-class type of the language.
- **FFI and interoperability**: embeddable from Rust, Python, JS, Go, C# and
  more.
- **WASM as a portable backend** and optional JIT (`clx run --jit`).
- **JIT (CLS → WASM → wasmtime)** as an experimental path.
- **LSP + VS Code extension + type maps**, and DX improvements like
  `async`/`await` and errors with trace.

Some roadmap milestones:

- Pipeline `lexer → parser → type checker → optimizer`.
- Backends: tree-walker, JSON, WASM and native.
- Module system with `.clslib` and multi-module checking.
- FFI and interoperability with native code.

## The new site

The website was rewritten with the Next.js App Router, i18n in Spanish and
English, and static generation. Downloads are now served from our own URLs
(`/download/release/cls-2.0.0-<plataforma>-<arquitectura>.<ext>`), fed by
versioned data, and we stopped pointing to GitHub releases.

In this first release we also debuted **Blog** and **Showcase** sections.

## What's next

- More devlogs about the native backend.
- Scripting, plugins and CMX tutorials.
- Contribution guides for the repository.

See you in the next devlog!
