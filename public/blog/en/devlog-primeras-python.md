# Devlog: the first CLS in Python (`cls_py` and `cls_py2.2`)

*Published on 2019-09-15 by the CLS Team*

In the [previous devlog](/blog/devlog-origenes-batch) we told how CLS was born
as a pile of `.bat` files inside `cmd.exe`, with its `goto ///end` and its
commands that were labels. That era ended when its author discovered he could
build the same language on top of something more solid than the Windows shell.
The next attempt was **Python**.

## The jump to Python

The implementations preserved from this stage are **`cls_py`** and
**`cls_py2.2`**, and they show something that never happened with Batch: this
time the language started to have its **own** syntax, with a real lexer and a
code generator. It was no longer a `for /f` reading lines with quotes as
delimiters: now there was a `lex.py` of more than 70 KB that analyzed the code
character by character.

The model was the same one from the end: CLS was **transpiled to Python**. The
`main.py` read the `.scls`, passed it through the lexer (`desline`) and then
`void()` turned it into real Python:

```python
def main(script):
    l.void(l.desline(script.read()), "main")
```

And inside `lex.py` lived the heart: `desline` (the lexer), `void` (the
translator to Python) and `build` (the one that assembled the output). There
were no classes, modules or CMX yet — that would come years later — but the
pieces were already forming.

## The syntax

The examples that survived are few but revealing. A "hello world" looked like
this:

```scls
include "std/cls.py"

fub main() {

	pr("hola mundo")

}
```

Look at the words: **`include`** to load the standard library, **`fub`** to
declare functions (a word that would survive in a strange form in later
versions), **`pr`** to print and the `{}` braces for blocks. There was no more
Batch `%variables%` or `goto ///end`: this already looked like a programming
language.

A loop over a list:

```scls
include "std/cls.py"

fub main() {

	lista1 = ["hola ", "mundo ", "como ", "estan"]
	for x in lista1
	{

		pr(x)

	}

	pr("texto completo: " + "".join(lista1) + "?")
	pr(lista1[0])

}
```

And access to command-line arguments, which was already part of the language:

```scls
include "std/cls.py"

fub main() {

	pr(arg)

}
```

The lexer recognized real keywords: `include`, `import`, `fub`, `class`,
`func`, `if`, `else`, `elseif`, `while`, `for`, `loop`, `return`, `global`,
`as`, `or`, `and`. The language had started to think for itself.

## The standard library

Here appears one of the most interesting parts of this stage: the stdlib was
loaded with `include "std/cls.py"`, and that file defined the language
environment as dictionaries — `clv` (global functions and values) and `impo`
(importable modules):

```python
clv["pr"] = stdcls.cls_pr
clv["input"] = stdcls.cls_input
clv["str"] = str
clv["int"] = int
clv["bool"] = bool
clv["list"] = list
impo["get"] = stdcls.cls_get
impo["file"] = stdcls.cls_file
impo["system"] = stdcls.cls_system
impo["string"] = stdcls.cls_string_op
```

Things already existed that we would later see evolve in the 1.0–1.1:

- **`system`** with `system.dir` (list, create, delete folders),
  `system.filename` (create, copy, rename, delete files) and `system.run` to
  execute commands.
- **`get`** with utilities like `get.arguments()`, `get.username()`,
  `get.ip()`, `get.osname()`.
- **`file`**, **`string`** (with `join`, `find`, `count`, `split`), and typed
  constructors: `int`, `str`, `bool`, `list`, `char`, `ord`, `len`.
- **`clwintk`**: an attempt to create **windows** with `tkinter` from CLS,
  with `win` objects (title, icon, size, `show()`).
- **`clson`**: a JSON-like data format, but with CLS's syntax — the distant
  ancestor of what would later become the compiled object.
- **`pyengine("os")`**: the escape hatch to import Python libraries directly,
  like `pyengine("os").path.dirname(...)`.

## The CLS "DLLs"

This version also had its own "DLL" system. The `cls32.dll` file was not a
Windows DLL: it was a **Python pickle** package containing the console's code
serialized with some metadata. The generator (`cls32_generate.py`) read
`meta.pyon`, a metadata file, and dumped it into the `.dll`:

```python
dll = eval(str(open("meta.pyon").read()).replace("\n", ""))
pickle.dump(dll, open(os.path.dirname(os.getcwd()) + "/" + "cls32.dll", "wb"))
```

The way to load that "DLL" from CLS was with `import`:

```scls
include "std/cls.py"

import get

fub main() {

	os = pyengine("os")
	pr(os.path.dirname(os.getcwd()))

}
```

A curious detail: the `meta.pyon` of `cls_py` mentions an *edition* called
**"Plix-Compiler"** with author "Hitako" and company "SmallSoftWare" — the
pseudonym of that era. And its metadata keeps a date: **15/9/2019**. That is
the trace that tells us when this version was written.

## `cls_py2.2`

The next iteration, `cls_py2.2`, refined the engine. The `main.py` was simpler
and `void` accepted the code in another way, preparing the "advanced
execution". The syntax was already testing more concepts: `func`, `class`,
`global` and `;` as terminator. A test file (`test.txt`) from that era shows
it:

```scls
name = (23+2)/23;
global name;

func name() {

};

class name {
    kill = "final";
};
```

Here we are no longer dealing with an improved Batch: it's a language with
functions, classes, global variables and types. The qualitative jump from the
2017 RC is enormous. But there was a problem that would repeat again and again
throughout CLS's history: **the engine fell short**. Transpiling to Python and
executing with `exec()` was functional, but every attempt to make the language
"big" hit the limits of that architecture.

## The legacy

`cls_py` and `cls_py2.2` were the first real CLS: with a lexer, with its own
syntax, with a stdlib. From here came the seeds of everything that would
follow — `fub`, `include`, the types, the `pyengine` that would later become
library access, and the idea of an engine that transforms CLS into another
language and executes it.

But the author, by then a bit more grown up yet still inexperienced, kept
searching. The next step was not to stay in Python: it was to port that whole
engine to **JavaScript**, and that implementation — `CLSJS` — ended up living
inside the 1.0–1.1 repository. That story has its own devlog.

---

*Previous: [the origins, CLS in Batch](/blog/devlog-origenes-batch) ·
Next: [CLSJS, the engine in JavaScript](/blog/devlog-clsjs).*
