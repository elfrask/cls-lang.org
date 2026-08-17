# Announcement: the CLS roadmap towards 2.2

*Published on 2026-08-17 by the CLS Team*

> **In short**: the 2.0 already has a **JIT interpreter** that reaches speeds
> similar to C++/Rust on some tasks and to JavaScript on others. This
> announcement clarifies the full **roadmap** towards 2.2, stage by stage.
>
> ⚠️ **Important**: the current state of the project is **not suitable for large
> projects**. It's ideal for automations, medium-sized applications and
> experimentation.

## What CLS has today (2.0)

The already published 2.0 includes:

- **Just-In-Time (JIT) interpreter**: CLS → WASM → wasmtime.
- Speeds **similar to C++ and Rust** on some tasks and **to JavaScript** on
  others (see the [2.0-dev1 status announcement](/blog/anuncio-estado-2-0-dev1)).
- Complete rewrite in Rust, static typing, OOP, CMX and C/Python/JS bindings.
- Binaries and VS Code extensions already available in the
  [downloads](/download).

## 2.0 roadmap

- **String handling optimizations**: avoid cloning strings on every operation.
- **REPL fixes**: severe bugs will be reviewed as they are found.
- **Active feedback**: reports about compilation failures, performance leaks and
  more.
- **`.clsapp` packaging**: compilation to package applications.
- **Active-strategy Garbage Collector**: to manage memory in the runtime. It can
  be **disabled** for better performance, managing memory with manual deletes.
- **Registry**: so the community can publish their own modules.
- **Async functions**: event loops across multiple threads.
- **Internals modules**: they will keep growing for more usability variety.

## 2.1 roadmap

- **`.clslib` support**: language libraries.
- **Native C extension optimization** (full optimization will require the AOT
  compiler).
- **More extensions for multiple languages**: currently only C, but support will
  be added for Rust, Fortran, ASM, Python and JavaScript (the last two may
  require optional modules).
- **More robust SDKs** for the bindings.

## 2.2 roadmap

- **AOT binary compiler**: to generate binaries that run on the system and
  binaries for **bare metal** (without an OS).
- **Internals optimizer**: smaller binaries, including only what's needed.
- **Escape-strategy Garbage Collector** for AOT compilation.
- **Native extensions** to remove the conversion overhead.
- **Embedded circuit optimization**: binaries aimed at devices.
- **Low-level mechanisms and statements**: absolute control over memory.

## Current status: honesty above all

The project is **not production-ready for large projects**. Today it's ideal
for:

- **Automations** and scripts.
- **Medium-sized applications**.
- Experimentation and prototyping.

Each roadmap stage brings us closer to a language suitable for more ambitious
projects. Thanks for joining the road towards 2.2.