---
title: Devlog: testing a mini HTTP framework with 2.0-dev1
date: 2026-08-17
author: CLS Team
excerpt: We put 2.0-dev1 to the test by building a mini HTTP framework (router + task CRUD + server on clshttp.dll). This report documents the language bugs we found: broken records at runtime, stringify(bool/null), break in loops, pointer-based string comparisons, and the workarounds that made the app work end to end.
tags: [testings, ffi-native, releases, release-dev]
image: /blog/assets/http-test-server-1.png
imageAlt: Screenshot of the CLS HTTP server test
imageCaption: Mini HTTP framework test on 2.0-dev1 (GET/POST/PUT/DELETE via sockets).
---

> 🔗 **Test repo**:
> [github.com/elfrask/mini-laravel-cls-http-server](https://github.com/elfrask/mini-laravel-cls-http-server)

This devlog is an honest report of a **real development test** on the
**2.0-dev1**: we tried to build a **mini HTTP framework** (router + task CRUD +
server on `clshttp.dll`) using the `clx` toolchain. It worked end to end, but
the journey exposed **serious JIT runtime bugs** and language limitations you
should know about if you're using 2.0-dev1 today.

> ⚠️ **Context**: the language isn't ready for large projects. This test is
> exactly the kind of exercise we need to find and fix these defects before the
> stable 2.0.

## What we tried to build

A basic HTTP server with:

- **Router** with path matching (`GET/POST/PUT/DELETE`).
- **Task CRUD** in memory (create, list, update, delete).
- Server on **`clshttp.dll`** (native FFI extension).
- Validated against the **real JIT**, with minimal reproduction probes and
  socket-based smoke tests.

## The language runtime bugs (the most severe)

All probes use the safe pattern (`if` with non-empty branches, positive
conditions, `startsWith`/`endsWith` comparisons).

| # | Defect | Symptom |
|---|--------|---------|
| 2.1 | **Broken records at runtime** | Index writes are silently dropped; state doesn't persist |
| 2.2 | **`int` inside records/arrays reads as garbage** | IDs, counters and numeric flags return corrupted values |
| 2.3 | **Writing to a record index → crash/garbage** | Undefined results when using records as state |
| 2.4 | **`break` inside loops is broken** | The assignment after `break` is lost if there's an `if` with an empty body |
| 2.5 | **`!expr` inside a `while` is broken** | Negated conditions don't evaluate correctly in loops |
| 2.6 | **`x == false` is broken** | Can't compare against `false` |
| 2.7 | **`if` with empty `else` inside `while` → lost assignment** | The flow skips the assignment |
| 2.8 | **`json.parse`'d records inside `while` → empty values** | Accumulators read from JSON in loops stay empty |
| 2.9 | **`==` compares pointers, not string values** | `"a" == "a"` can be `false` |
| 2.10 | **`str()` of a string in a parsed record returns a pointer** | Serializing a JSON-read string gives garbage |
| 2.11 | **`json.stringify(bool)` returns `""`** | A `PUT` with `{"done":true}` didn't update the field |
| 2.12 | **`str(bool)` returns `"1"`/`"0"`** | Can't distinguish `true` from a numeric value |
| 2.13 | **`json.stringify(null)` triggers a TRAP** | The handler dies silently: the client never gets a response |
| 2.14 | **Invalid `json.parse` triggers a silent TRAP** | The handler dies without a trace or HTTP response |

### Known language bugs (summary)

These are the documented bugs that affect 2.0-dev1 at runtime. Knowing them is
the first step towards fixing them:

- **Records**: index writes are dropped and `int`s read as garbage.
- **`==` on strings**: compares pointers, not values.
- **`break`, `!` and `== false` inside `while`**: break the following assignment
  and negated conditions.
- **`json.stringify(bool)` and `json.stringify(null)`**: return empty or kill
  the handler without a trace; invalid `json.parse` too.
- **`clx check` doesn't protect you**: it validates types but not JIT behavior;
  you have to run the code to detect these errors.

## The server and the FFI extension

The server DLL (`clshttp.dll`) does exactly what it's asked to do. The root of
the integration problems was mostly **in the language**:

- The **silent TRAP** (§2.13/2.14) kills the handler without a trace: the server
  keeps waiting and the client never gets a response → looks like a "hang".
- The runtime **doesn't report traps** (no log or error code): language failures
  get confused with server failures.
- The **first request after startup** can get a connection reset
  (`WSAECONNABORTED`): a race between CLS startup and the listener.
- A wrong `Content-Length` ends in a late, misleading `400` (5 s timeout)
  instead of a clear protocol error.

There was one real DLL defect — `read_request` dropped the body when it arrived
in the same packet as the headers — already **fixed** in `lib.rs`: the leftover
`head` bytes are consumed as body and only the remaining difference is `recv`'d.

## Previously unknown bugs

During this test, language bugs that weren't documented or known came to light:

- `==` compares string **pointers**, not values (and `str()` of strings in
  records returns pointers).
- Records have **broken runtime semantics**.
- `break`, `!`, `== false` and `if` with an empty branch are unsafe inside
  `while`.
- `json.stringify(bool)` returns `""`, and `json.stringify(null)` or invalid
  `json.parse` trigger a **silent TRAP**.
- **There's no mechanism for the JIT to report a TRAP** (log, exception, error
  code): failures look like server hangs.

## Summary

1. **The language's biggest risk is the JIT runtime**: records, `break`,
   negation, string `==`, `json.stringify` (bool/null) and invalid `json.parse`
   produce **silent corruption or untraced traps**.
2. **`clx check` doesn't protect you**: it validates types, not JIT behavior.
3. The server does what it's asked; the "hangs" and integration failures were
   rooted in the language's silent traps and the runtime's lack of error
   reporting (the only real DLL defect, the dropped body, is already fixed).
4. **Final state**: the task CRUD app works end to end over HTTP
   (GET/POST/PUT/DELETE/404/validations) after the record-free state rewrite,
   body extraction without `json.parse` and the DLL body fix.

This kind of testing is exactly what moves the roadmap towards stable 2.0.
Every bug found here is one more item to fix in upcoming releases.