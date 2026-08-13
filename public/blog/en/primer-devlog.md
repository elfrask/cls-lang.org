# Announcement: CLS 2.X, the path we're building

*Published on 2026-08-12 by the CLS Team*

Today we're announcing the direction of the next generation of CLS: the **2.X**
series. It's the most ambitious stage of the language so far: a complete
rewrite **in Rust**, with **static typing** and a **JIT interpreter** as its
foundation.

> **Current status**: CLS 2.X is still in development and has no release date
> yet. We're wrapping up the QA evaluations before publishing the first stable
> release of the series. We tell you the exact state in the
> [2.0-dev1 announcement](/blog/anuncio-estado-2-0-dev1).

## The direction of 2.X

The 2.X series starts from a question we'd been carrying since the earlier
versions: how do we make CLS **fast** without giving up what makes it special —
running everywhere?

- **1.0–1.1** transpiled to Python and solved portability, but with very long
  compile times.
- **1.2** tried a Cython rewrite and achieved performance, but it became tied
  to platform and architecture, and never got a working executor.

The 2.X takes the best of both: the ambition of the 1.0–1.1, the lesson of the
1.2 (starting from scratch is worth it) and a new answer for portability.

## What it brings

- **A Rust rewrite**, with a `lexer → parser → type checker → optimizer →
  backends` pipeline.
- **TypeScript-style static typing**, with unions, generics, literal types,
  tuples and records.
- **A JIT interpreter** as an execution path.
- **Backends**: tree-walker, JSON, WASM (portable) and native binary
  compilation.
- **A module system** with `.clslib` and multi-module checking.
- **FFI and interoperability**: embeddable from Rust, Python, JS, Go, C# and
  more.

## How it's progressing

The 2.X series is advancing on top of the JIT interpreter. In the
[2.0-dev1 announcement](/blog/anuncio-estado-2-0-dev1) we tell you exactly
where development stands: the language is ~90% ready and the first release
will ship with the JIT interpreter before the version with the compiler.

## What's next

- Finish the QA evaluations and publish the first release of the 2.X series.
- More devlogs about the backends: the JIT, the native one and WASM.
- Scripting, plugins and CMX tutorials.
- Contribution guides for the repository.

We'll keep telling the story on the blog. Thanks for joining the road to 2.X.