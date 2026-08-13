# Announcement: the current state of CLS 2.0-dev1

*Published on 2026-08-13 by the CLS Team*

Today we want to tell you exactly where the next generation of CLS stands.
We've been working on the **2.0** — a complete rewrite in Rust with static
typing and a JIT interpreter — and we're on the home stretch toward the first
stable release.

> **Current status**: the language is **~90% ready**. The **2.0-dev1** is going
> through strict QA evaluations before we publish the first public binaries.
> There are no downloads available yet.

## What the 2.0 series is

The 2.0 is the most ambitious stage of the language so far: a complete rewrite
in **Rust** with **static typing**, a `lexer → parser → type checker →
optimizer → backends` pipeline, and a **Just-In-Time (JIT) interpreter** as its
main execution path.

## The JIT interpreter

The milestone we're about to ship is the **JIT** interpreter. It's the piece
that changes the performance rules of CLS:

- It promises speeds on the order of **×8000** over the previous versions of
  the interpreter.
- In our internal evaluations it lands **very close to native performance**.

With this interpreter, the first stable release will run programs with a
fraction of the overhead the 1.x versions suffered.

## JIT first, the compiler later

An important decision for this stage: **the first release of the 2.0 series
will ship only with the JIT interpreter**. The compiler (native binary
compilation) will come in a later version, built on the same foundation.

This lets us validate the core of the language in production — typing, modules,
FFI and the JIT itself — before adding the compilation layer.

## QA evaluation

The 2.0-dev1 is going through strict, quality-driven QA evaluations. In those
tests we keep finding and fixing issues in the current 2.0 implementation
(which still doesn't compile cleanly from the working tree), while the JIT is
already showing strong results in the performance tests.

The public binaries will be published once the QA evaluation gives the green
light.

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

## What's next

- Finish the QA evaluations and publish the **2.0** with the JIT interpreter.
- More devlogs about the backends: the JIT, the native one and WASM.
- Scripting, plugins and CMX tutorials.
- Contribution guides for the repository.

We'll keep telling the story on the blog. Thanks for joining the road to 2.0.