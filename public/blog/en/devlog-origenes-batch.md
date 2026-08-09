# Devlog: the origins, CLS in Batch

*Published on 2017-02-20 by the CLS Team*

Before 1.0, before the 1.0–1.1 in Python and the 1.2 in Cython, CLS existed. And
it looked nothing like the CLS we know today. This post is the first in a
series that rebuilds the early history of the language, and it starts where
everything started: a 12-year-old kid and a `.bat` file.

## The uncomfortable truth

1.0 was not the first implementation of CLS, nor the second, nor the seventh.
When someone opens the repository and sees the 1.0–1.1 in Python, they are not
seeing the birth of the language: they are seeing the most mature chapter of a
story that started years earlier, in the Windows CMD, with a syntax that had
**nothing** in common with the current one.

The first CLS was a prototype written in **Batch script**. Shaky, fragile,
prone to escaping the rules of the host language, and so basic that it could
barely be called a programming language. It was written by a young "Frask" at
age 12, completely inexperienced, and from that era at least **9 rewrites** of
the same language survived, each one trying different things.

## The engine trick

If you don't know Batch, the idea of building a "programming language" on top
of `cmd.exe` sounds insane. The trick that made it work was brutally simple:
the engine read the source file (`.scls`), dumped it into a temporary file and
then *goto'd* a label for each command.

```batch
type %pth%>temp.tmp
for /f "tokens=1,2* delims='" %%i in (temp.tmp) do (
    call :/loading %%i
)
```

Each language command was, literally, a `:` label inside the `.bat` itself.
The "parser" was Batch's `for /f` and the "interpreter" was the
`call :/_command`. And since Batch had no decent way of returning control
after a `call`, every command ended with the same immortal jump:

```batch
set e_d=_fin_
goto ///end
```

That `goto ///end` —with the three slashes— is the heart of the first CLS. It
was the improvised return mechanism of a language built on a shell that was not
designed for that. And it worked, in its own way.

## The RC (20/02/2017)

The oldest surviving version is the **RC**, dated 20/02/2017. It may not have
been the first attempt, but it is the first one we have something physical
from: the complete `rc/` with its `source/` folder, its library `.bat` files,
its supporting executables (`batbox.exe`, `GetInput.exe`, `Fn.dll`) and even
two `.scls` tests.

The syntax back then was simple, but it was already a syntax:

```scls
print "hola mundo"
input
```

```scls
setmouse _xc _yc
print "cordenadas x:%_xc% y:%_yc%"
input
```

Notice the mix: English commands (`print`, `input`, `setmouse`), and variables
using Batch's `%...%` notation leaking straight into the code. That mix is
exactly the "completely different syntax" I was talking about: there is no
`func`, no `{}`, no types. There are `print`, `input`, `clear`, `mode`,
`title`, `color` and external programs doing the dirty work.

The RC lived in `C:/cls/rc`, loaded a program "database" and had a `source/`
folder with the commands as loose files: `_print.bat`, `_input.bat`, `_if.bat`,
`_bucle.bat` (a `for /l` disguised as a loop), `_button.bat`, `_menubar.bat`,
`_import.bat` (which loaded DLLs and dumped them as `.imp`), `_play.bat`,
`_dowload.bat`... One bat per command.

```batch
:: _if.bat — the RC's "if"
set if_cont=%1
set ac_if=%~2
set if_to=%3
set if_com=%~4

if %if_cont% %ac_if% %if_to% %if_com%
set e_d=_fin_
```

And so, with Batch's `if` as the language's `if`, a language was built.
Fragility by design: a misplaced space, a weird character in a path, or an
undefined variable, and the whole script escaped the language's own rules to
fall into the `cmd.exe` underneath, showing errors nobody on the team
understood.

## The rewrites

From that RC came at least 9 rewrites over the following years, each one trying
something different. Several of them are preserved in the old files, and you
can see the evolution with each attempt:

- **`viejo`** — with its `codetext` subfolder (the first "code editor",
  CLSCodeText) and a `desarrollo/` folder with a help file that summed it up
  better than anyone: *"programming language created by a 13-year-old kid"*.
  Here the syntax already used `call` and `.clsfrm` modules:

  ```batch
  call import button
  call import linecolor
  call main

  title prueba

  call linecolor 1c "Hola mundo"
  ```

  There was an interactive shell with a `CLS#` prompt that read the program and
  executed it line by line, and the idea of **modules** (`.imp`) was already
  peeking through: `import` copied the contents of an `.imp` into a `.bat` and
  called it.

- **`Nuevo RCFINAL`** — the attempt to close out the RC era: a much bigger
  `deb.bat` (over 21 KB), an `ls.src` with the "source code" of the language,
  a `MenuBar.bat` that used `batbox.exe` to draw menus with the mouse, a
  `CLSTUDIOS!1.0` installer and even `.reg` records to integrate with Windows.
  Here each command was `:_print`, `:_setmouse`... the language had matured
  into a more ordered form than the original RC.

- **`cls`** — a `deb.bat` that described itself as a "cls error-proof shell",
  an advanced version of the shell with direct commands: `print`, `input`,
  `integer`, `string`, and a welcome message that said "version de cls
  avanzada".

- **`gra`** — the most ambitious attempt of the Batch era: **graphical CLS**.
  Here the language changes its face again, with `import Windows.Grafic`,
  `import Windows.Script`, and a syntax that already looks like a real
  language:

  ```scls
  int Window main {

  print "hola mundo"
  backcolor "yellow"
  title "Hello World"
  button "precioname"
  inputbar "value='fx'"
  img "https://ejemplo.com/imagen.jpg" "250" "350"
  main "none" "dialog" "normal" "no"
  msgbox "Hola Mundo" "vbcritical" "hello"

  }
  ```

  `gra`'s trick was more sophisticated: instead of only running in the console,
  the engine generated a `.hta` —a Windows HTML application— and launched it,
  opening the door to buttons, images, dialogs and even embedded VBScript.
  Among its tests there was even a **Pong in VBScript**. It was the CLS closest
  to "a real window" in the entire Batch era.

## Why it matters

That 12-year-old kid didn't know how to write a compiler, he probably didn't
even know what a lexer was. What he knew how to do was *hit the keyboard until
something worked*: over and over, at least 9 times, building a language on the
limits of `cmd.exe` and learning —mostly by failing— what a command, a
variable, a loop, a module was.

Everything that sounds embarrassing today is, in fact, the origin of
everything: the obsession with **modules**, the idea of **compiled files**,
the love for a **CLS that opened windows**, and even the `.scls` name we still
use. Without those 9 rewrites in Batch, the 1.0 would not exist.

## What came next

This era ended when Frask discovered he could build the same language on top of
something much more solid. The next step was **Python** (`cls_py`,
`cls_py2.2`), and later the port to **JavaScript** (`CLSJS`), which ended up
living inside the 1.0–1.1 repository. Those two stages have their own devlogs,
but the story —the real one, the one about the kid and the `.bat`— starts here,
on 20/02/2017.
