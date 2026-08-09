# Devlog: CLS 1.0–1.1, the version that consolidated the language

*Published on 2025-06-10 by the CLS Team*

Today we're talking about the 1.0 and 1.1 versions. But first, a clarification
we owed you: **they were not the first implementation of CLS**. By the time
they started being written, the language had already gone through a long series
of previous explorations — the prototype in [Batch](/blog/devlog-origenes-batch),
the first [implementations in Python](/blog/devlog-primeras-python) and the
engine in [JavaScript](/blog/devlog-clsjs). The 1.0 was the first **official
and numbered** version, the point where the project stopped being a series of
attempts and became something that could be versioned, published and used.

## The starting point

CLS was then a personal project, written **in Python**, that was already
carrying years of evolution. The README of that time said it itself: *"it is a
programming language created for me as hobby in his startings. but with the
time this be convert in my project more ambitious"*. The CLI startup summed it
up well: *"Cls 1.1.1 - Build for win32 platforms, CLS 2016-2025"*, under the
*Vinestar Studio* brand. Notice the "2016-2025": the start date looked far
back, to those early prototypes.

## How the engine worked

The 1.0–1.1 version was not a classic interpreter: it was a **transpiler that
generated Python code and executed it with `exec()`**. The whole engine lived
in a single file of about 3600 lines (`clsengine.py`) with a six-stage
pipeline:

1. `desline` — the lexer, which reads character by character.
2. `parselex` — groups `()`, `[]` and `{}`.
3. `estructuration` — recognizes each type of statement in the language.
4. `generator` — emits the equivalent Python code.
5. `jump` — joins everything with the correct indentation.
6. `exec` — executes the generated Python.

It's no coincidence that those names sound familiar: they were inherited from
the **CLSJS** engine in JavaScript, which already used the same pipeline
(`desline → parselex → estructuration → generator → jump → exec`). The 1.0–1.1
was the return to Python with everything learned along the way.

CLS variables were renamed with the `var_` prefix so they wouldn't collide with
the generated code, and type checking was done at runtime.

## The language in 1.0–1.1

Already in this version the language was surprisingly complete. A look at
`test.scls` shows most of the features:

- Typed functions with return: `function holabb() -> str`.
- Lambdas: `var FA = (xd) -> String { return xd + xd + xd; };`.
- `if` / `elif` / `else` and even **if-expressions**:
  `print(if (ask == "s") then ("es verdadero") else ("no es verdadero"))`.
- `switch` / `case` / `case default`, `while`, `for`, `for each` and `with`.
- `try` / `catch` for error handling.
- **OOP**: classes with a `function main()` constructor (mapped to `__init__`),
  `me` as `this`, inheritance and visibility (`export`, `static`, `private`,
  `public`, `global`).
- `struct` with typed fields and dot access.
- `namespace` and nested modules:
  `module useModules { ... }; useModules.subModule.hi()`.
- `import` / `from` / `include` and templates (`template`).
- Arrays with methods (`forEach`, `map`, `filter`, `push`) and dictionaries.
- Special types like `char`, `intbit` (bit integers), `hex`/`bin`/`oct`,
  booleans (`true`/`false`/`on`/`off`) and `Promise` with `.then()` and
  `.catch()`.

And of course **CMX**, the JSX-like markup that is still part of the language's
identity:

```clsx
hola = <div>Hola mundo!</div>;
```

The standard library already covered quite a bit: `fs` modules (files,
directories, async read/write with threads), `os` (processes, environment
variables) and `http` with requests and promises. It even had an easter egg in
the code table: the `418 im_a_teapot`.

## The experiments around it

The 1.0–1.1 was also a time of many experiments:

- **Casm**: an assembly-like language with its own linear-memory VM, which
  compiled to `.cobj` or JSON.
- **CLSJS**: the port of the engine to JavaScript that we already told in its
  own [devlog](/blog/devlog-clsjs) — it lived inside this same repository.
- **Godot**: a transpiler from CLS to GDScript, with an example game.
- **CPKG**: a package manager with a developer account and templates.
- **Brython**: experiments to run CLS directly on the web.

## The problem

With all that scope, there was a problem that became more and more evident:
**compile times were very long, even with not-very-large files**. Transpiling
to Python and executing with `exec()` was not a fast path.

That was the motivation to try a rewrite from scratch. We tell that in the next
devlog.

---

*Versions: [CLS 1.0–1.1](https://github.com/elfrask/cls/tree/1.0-1.1).*
