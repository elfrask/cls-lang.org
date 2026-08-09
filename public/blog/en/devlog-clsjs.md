# Devlog: CLSJS, the engine in JavaScript

*Published on 2022-02-08 by the CLS Team*

After the first CLS in Python ([cls_py and cls_py2.2](/blog/devlog-primeras-python)),
the author kept searching. Instead of staying in Python, he decided to port the
whole engine to **JavaScript**. That implementation was called **CLSJS**, it
was developed in late 2020 and finished on 8 February 2022. And although today
it lives hidden inside the 1.0–1.1 repository, it was one of the most important
stages in the history of the language.

## What CLSJS was

CLSJS was the CLS engine rewritten **from scratch in JavaScript** — a single
`CLSJS.js` of over 100 KB (~2600 lines). It kept the idea of the Python engine
(a transpiler that turns CLS into another language and executes it), but now
the target was **JavaScript** instead of Python, and it could run in two places
at once:

- **In Node.js**, as a CLI that read a `.scls`, transpiled it and executed the
  resulting `.js`.
- **In the browser**, compiling and executing CLS directly on a web page.

## The engine

The pipeline was from the same family as the Python engine, but with names that
would mark the 1.0–1.1 engine (and that we'd see repeated later):

```javascript
let app = aplicacion.Script(data, g);
let d_crudo = app.desline(data)          // lexer
let parseado = app.parselex(d_crudo)     // groups () [] {} <>
let estructurado = app.estructuration(parseado)  // recognizes statements
let generado = app.generator(estructurado, "normal")  // emits JS
let salida = app.jump(generado, 0)       // joins with indentation
app.exec(salida)                          // eval
```

An important detail: the names `desline`, `parselex`, `estructuration`,
`generator` and `jump` — the engine's internal vocabulary — already existed
here, in JavaScript. Those same terms were the ones that later described the
1.0–1.1 engine. CLSJS was the bridge.

Variables were renamed with the `var_` prefix (same as later in Python), the
library types lived in an `Api` object (`String`, `Integer`, `Float`, `Array`,
`Function`, `Module`), and execution ended up being an `eval` of the generated
code wrapped in a `try/catch` that reported the error with its line number:

```javascript
app.index = 25
try {
    var_ )
} catch (e) {
    app.error(e, 'ErrorExec', 25)
}
```

## The syntax in CLSJS

The syntax that would reach the 1.0–1.1 started to take shape here. The
`app.scls` of the web demo shows most of the pieces:

```scls
import "document" as document;
from "window" import alert as alerta;
import "os" as os;

function main(argv:Array) -> void {
    print("[PID:"+ os.pid +"~platform:"+ os.osname +"]");
    print("CLS Console - Frask - Vinestar (2021)");
    print("(C) Todos los derechos reservados");
    print("\n\nCLS-Webview~User> ");

    document
};

main(process.argv)
```

There they are:

- **`import` / `from ... import ... as ...`** for modules.
- **Typed arrow functions**: `function main(argv:Array) -> void`.
- **`print`** as output.
- Access to the **operating system** (`os.pid`, `os.osname`), what used to be
  Python's `pyengine("os")`.
- And the signature of the era: *"CLS Console - Frask - Vinestar (2021)"*.

The lexer already had its list of reserved words, the ones we know from the
1.0–1.1:

```javascript
"class", "function", "async", "def", "method", "func", "fub", "module",
"namespace", "sync", "with", "import", "private", "public", "export",
"static", "from", "include", "if", "while", "for", "using", "var", "as", "try"
```

And the generator already knew how to emit **classes** with visibility
(`public`, `private`, `export`, `static`), with `me` as `this`, the `private`
object, the class exports and the default constructors — the same design we'd
later see in the 1.0–1.1 Python engine.

## CLS in the browser

The most ambitious thing about CLSJS was running CLS on the web. The engine
detected whether it was in Node or in the browser (with `this.require`): in
Node it used `process.pid` and `process.platform`; on the web it invented a
random PID and set `osname = "web"`.

The demo page loaded it like this — a native CLS script in HTML:

```html
<script src="../CLSJS.js"></script>

<div id="_ccls"></div>

<script type="cls/script" src="app.scls"></script>
```

On startup, CLSJS looked for all `<script type="cls/script">` tags, compiled
them one by one (respecting the `async` attribute) and executed them over the
DOM. CLS ran in the browser without previous transpilation: the web itself ran
CLS. There was also an **`openserver.js`** with Express that served the engine
on port `2020`, to load `CLSJS.js` and its modules from a page.

## CMX and the map

It was in CLSJS where the JSX-like markup — **CMX** — appeared for the first
time. The `test.scls` in the folder proves it:

```clsx
hola = <div>
        Hola mundo!
    </div>;
```

And when compiling, the engine generated two files: the executable `.js` and a
`.map` with the structured tree. In that map the token `"cml"` (CMX) already
appears as a first-class data type:

```json
{
    "i": 25,
    "eval": [
        {
            "data": "<div> Hola mundo! </div>",
            "i": 25,
            "tipo": "cml"
        }
    ],
    "tipo": "exec"
}
```

## The legacy

CLSJS didn't become "the official version" of CLS by itself: when the Python
implementation of the 1.0–1.1 took center stage, the JS engine remained as an
experiment inside the same repository. But its importance is huge:

- It consolidated the modern **syntax** of the language (imports, typed
  functions, classes with visibility, CMX).
- It fixed the **internal vocabulary of the engine** (`desline`, `parselex`,
  `estructuration`, `generator`, `jump`).
- It proved that CLS could run **on the web**, a goal that would appear again
  and again (WASM, portable backend, JIT) until the 2.0.

As always in this story, the author was still a programmer learning the hard
way: each implementation taught him something the next one took advantage of.
CLSJS was the one that proved the language could live in more than one place at
a time.

And it was right after this that the author sat down to write the version he
would finally call 1.0. That is the next story.
