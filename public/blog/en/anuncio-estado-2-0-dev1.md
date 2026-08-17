# Announcement: the current state of CLS 2.0-dev1

*Published on 2026-08-13 by the CLS Team · Updated on 2026-08-17*

> **Current status**: the **2.0-dev1 is now published** with binaries available on
> the [downloads page](/download). The latest **JIT** benchmark (Phase 3: fused
> WASM internals) confirms the performance: in arithmetic CLS is on par with
> C++/Rust and **100x+ faster than Python** on several tests.

## What the 2.0 series is

The 2.0 is the most ambitious stage of the language so far: a complete rewrite
in **Rust** with **static typing**, a `lexer → parser → type checker →
optimizer → backends` pipeline, and a **Just-In-Time (JIT) interpreter** as its
main execution path.

## The JIT interpreter

The central milestone of this stage is the **JIT** interpreter. It's the piece
that changes the performance rules of CLS:

- It promises speeds on the order of **×8000** over the previous versions of
  the interpreter.
- In the latest benchmark it lands **very close to native performance**.

### Latest benchmark (Phase 3: fused WASM internals)

Averages of 3 runs, in **ms** (lower is better), wasmtime:

| Test | Load | **CLS** | C++ | Rust | JS | Python |
|---|---|---|---|---|---|---|
| **Arithmetic** | 20M iter | **90.7** | 91.1 | **82.8** | 109.2 | 12 111.7 |
| **Recursive fib** | fib(30) | 4 391 | **2.1** | 2.3 | 12.4 | 173.7 |
| **Arrays** | 100k | 344.7 | **0.2** | 0.2 | 6.2 | 4.9 |
| **Strings** | 10k | 52 | 0.1 | **0.03** | 0.2 | 4.1 |
| **Math** | 200k | 80.3 | 8.5 | **1.8** | 7.9 | 85.5 |
| **Calls** | 1M | 1 918.7 | 0* | 0* | **3.5** | 199.6 |

\* C++/Rust with `-O3` **inline** `cuadrado` (0ms — not comparable).

### Before vs after Phase 3

| Test | Before | With fused WASM internals (today) | Target | Status |
|---|---|---|---|---|
| arith | 90.7ms | **94.0ms** | ~90ms (=) | ✅ no regression |
| fib(30) | 4 391ms | **13.3ms** | ≤300ms | ✅ **×330** |
| arrays (100k push) | 345ms | **0.7ms** | ≤40ms | ✅ **×493** |
| math (sqrt/sin) | 80.3ms | **5.3ms** | ≤25ms | ✅ **×15** |
| calls (1M) | 1 919ms | **4.0ms** | ≤200ms | ✅ **×480** |

The speedup comes from fusing the **internals inside the CLS module** (zero
`env.str_*`, `env.arr_*`, `env.math_*` imports) and from the **shadow call
stack** in linear memory (0 host calls). The WAT of the benchmarks doesn't
import internals: 0 migrated imports, 77 remaining (I/O + errors + node).

### Suites and quality

- `run-availible.ps1`: **25 PASS** · `run-tests.ps1`: **21 PASS** (+7 SKIP).
- `cargo test` (workspace): **184 PASS, 0 FAIL**.
- Errors with full trace, persistent-state REPL and wasmi parity.

## JIT first, the compiler later

An important decision for this stage: **the first release of the 2.0 series
ships only with the JIT interpreter**. The compiler (native binary compilation)
will come in a later version, built on the same foundation.

This lets us validate the core of the language in production — typing, modules,
FFI and the JIT itself — before adding the compilation layer.

## What the 2.0 series brings

- **A Rust rewrite**, with a `lexer → parser → type checker → optimizer →
  backends` pipeline.
- **TypeScript-style static typing**, with unions, generics, literal types,
  tuples and records.
- **A JIT interpreter** as the execution path, with near-native performance.
- **Backends**: tree-walker, JSON, WASM (portable) and, later, native binary
  compilation.
- **A module system** with `.clslib` and multi-module checking.
- **FFI and interoperability**: embeddable from Rust, Python, JS, Go, C# and
  more.
- **Toolchain**: `clx` CLI, the lightweight `clxr` runtime, LSP and C/Python/JS
  bindings.

## What's next

- More devlogs about the backends: the JIT, the native one and WASM.
- Scripting, plugins and CMX tutorials.
- Contribution guides for the repository.

We'll keep telling the story on the blog. Thanks for joining the road to 2.0.