# Devlog: CLS 2.0-dev1, the first release of the 2.0 series

*Published on 2026-08-17 by the CLS Team*

**Version**: 2.0.0-dev-1 · **Branch**: `releases` · **Date**: first release of the 2.0 series

This is the first release of the **2.0** line. As the first version of this
series, the comparison is only against its predecessors **1.1** and **1.2** —
there is no earlier 2.0 to compare with.

---

## Where we come from: 1.1 and 1.2

### CLS 1.0–1.1
- Original implementation in **Python/Cython** (`ccls.py` interpreter, `clslang/`
  engine).
- Slow compilation even for small files; the project itself acknowledged it as
  its main problem.
- A project in constant progress, but without reaching acceptable performance
  for real use.

### CLS 1.2
- "The performance version": a from-scratch rewrite of the engine to tackle
  **compile times**.
- Still **Python/Cython**, with an experimental executable (`ccls.py`,
  `main.pyx`).
- Tagged as **EXPERIMENTAL** and *not suitable for projects*: it was a
  performance prototype, not a stable version of the language.

---

## What changes in 2.0-dev1

The 2.0 series is **not an evolution of 1.2**: it is a **complete rewrite in
Rust** (a workspace of 7 crates/nodes) with a modular architecture and a
WASM-oriented pipeline. This tackles both problems that sank 1.1/1.2 at the
root:

| | 1.1 | 1.2 | **2.0-dev1** |
|---|---|---|---|
| **Implementation** | Python/Cython | Python/Cython | **Rust** |
| **Execution** | Interpreter (tree-walker) | Experimental interpreter | **JIT interpreter** (CLS → WASM → wasmtime) + deprecated tree-walker |
| **Performance** | Slow | Slow (prototype) | **JIT/WASM**: fib 4391ms → 13ms, arrays 345ms → 0.7ms, math 80ms → 5ms |
| **Pipeline** | parse → run | parse → run | `.clsx` → lexer → parser → AST → **typeck** → **WASM** → wasmtime |
| **Typing** | dynamic | dynamic | **compile-time type checker** (`clx check`) |
| **Modules** | basic imports | basic imports | **2 systems**: `import` (source) + `Lib.load` (`.clslib`) |
| **Status** | hobby, slow | experimental | **ready for release** (audited) |

## Highlights over 1.1/1.2

- **Language**: OOP (classes, inheritance, `super`, `private/protected/public/static/readonly`
  visibility), enums, tuples, typed records, type aliases, unions, generic
  interfaces, generics, the `is` operator, arrow functions, CMX (native JSX),
  async/await, try/catch/finally.
- **WASM backend**: WASM code emitted by the compiler, run by wasmtime (JIT) or
  wasmi; precompiled internals fused inside the CLS module (zero imports),
  shadow call stack in linear memory.
- **Error system**: full trace with numbered call stack and source, in an
  extensible format (Plain/Console/Html/Json).
- **Toolchain**: `clx` CLI (new, run, check, build, ast, repl, maptype, lsp, add,
  install), the lightweight `clxr` runtime, an LSP server, a VS Code extension,
  and C/Python/JS bindings (`clsb`).
- **Stdlib**: `math`, `json`, `fs`, `http`, `Lib` + boxless primitive methods
  (static dispatch tables).
- **Distribution**: per-OS portables, standalone binaries, extension and
  bindings published automatically by this CI pipeline on push to `releases`.

---

## Status

- **Ready for release**: audited and verified (see the `audit(release2.0-dev1)`
  commit).
- **Road to 2.0-dev2 and beyond**: more `v2.0.0-dev-N` releases will follow,
  each with its devlog in `devlogs/`; the series ends at `v2.0.0-release`.

You can now download the binaries from the [downloads page](/download).