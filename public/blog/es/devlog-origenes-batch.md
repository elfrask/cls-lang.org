# Devlog: los orígenes, CLS en Batch

*Publicado el 2017-02-20 por Equipo CLS*

Antes de la 1.0, antes de la 1.0–1.1 en Python y de la 1.2 en Cython, CLS
existió. Y no se parecía en nada al CLS que conocemos hoy. Esta entrada es la
primera de una serie que reconstruye la historia temprana del lenguaje, y
empieza donde todo empezó: un niño de 12 años y un archivo `.bat`.

## La verdad incómoda

La 1.0 no fue la primera implementación de CLS, ni la segunda, ni la séptima.
Cuando alguien abre el repositorio y ve la 1.0–1.1 en Python, no está viendo el
nacimiento del lenguaje: está viendo el capítulo más maduro de una historia que
arrancó años antes, en el CMD de Windows, con una sintaxis que no tenía **nada**
que ver con la actual.

El primer CLS fue un prototipo escrito en **Batch script**. Endeble, frágil,
propenso a salirse de las propias directrices del lenguaje anfitrión, y tan
básico que apenas podía llamarse lenguaje de programación. Lo escribió el
pequeño "Frask" a los 12 años, totalmente inexperto, y de aquella época
quedaron al menos **9 reescrituras** del mismo lenguaje, cada una probando
cosas distintas.

## El truco del motor

Si no conoces Batch, la idea de construir un "lenguaje de programación" sobre
`cmd.exe` suena descabellada. El truco que lo hacía funcionar era brutalmente
simple: el motor leía el archivo fuente (`.scls`), lo volcaba a un archivo
temporal y luego le daba *goto* a un símbolo por cada comando.

```batch
type %pth%>temp.tmp
for /f "tokens=1,2* delims='" %%i in (temp.tmp) do (
    call :/loading %%i
)
```

Cada comando del lenguaje era, literalmente, una etiqueta `:` dentro del
propio `.bat`. El "parseador" era el `for /f` de Batch y el "intérprete" era
el `call :/_comando`. Y como Batch no tenía forma decente de devolver control
después de un `call`, todos los comandos terminaban con el mismo salto
inmortal:

```batch
set e_d=_fin_
goto ///end
```

Ese `goto ///end` —con las tres barras— es el corazón de la primera CLS. Era el
mecanismo de retorno improvisado de un lenguaje construido sobre un shell que
no fue diseñado para eso. Y funcionaba, a su manera.

## El RC (20/02/2017)

La versión más vieja que se conserva es el **RC**, fechada el 20/02/2017.
Puede que no fuera el primer intento, pero es el primero del que quedó algo
físico: el `rc/` completo con su carpeta `source/`, sus `.bat` de librería, sus
ejecutables de apoyo (`batbox.exe`, `GetInput.exe`, `Fn.dll`) y hasta dos
pruebas en `.scls`.

La sintaxis de ese entonces era simple, pero ya era una sintaxis:

```scls
print "hola mundo"
input
```

```scls
setmouse _xc _yc
print "cordenadas x:%_xc% y:%_yc%"
input
```

Fíjate en la mezcla: comandos en inglés (`print`, `input`, `setmouse`), y
variables con la notación `%...%` de Batch colándose directamente en el código.
Esa mezcla es exactamente la "sintaxis totalmente distinta" de la que hablaba:
no hay `func`, no hay `{}`, no hay tipos. Hay `print`, `input`, `clear`,
`mode`, `title`, `color` y programas externos haciendo el trabajo sucio.

El RC vivía en `C:/cls/rc`, cargaba una "base de datos" del programa y tenía
una carpeta `source/` con los comandos como archivos sueltos: `_print.bat`,
`_input.bat`, `_if.bat`, `_bucle.bat` (un `for /l` disfrazado de bucle),
`_button.bat`, `_menubar.bat`, `_import.bat` (que cargaba DLLs y las volcaba
como `.imp`), `_play.bat`, `_dowload.bat`... Un bat por comando.

```batch
:: _if.bat — el "if" del RC
set if_cont=%1
set ac_if=%~2
set if_to=%3
set if_com=%~4

if %if_cont% %ac_if% %if_to% %if_com%
set e_d=_fin_
```

Y así, con el `if` de Batch como `if` del lenguaje, se construía un lenguaje.
Fragilidad por diseño: un espacio mal puesto, un carácter raro en una ruta, o
una variable sin definir y todo el script se salía de las directrices del
propio lenguaje para caer en el `cmd.exe` de abajo, mostrando errores que
nadie del equipo entendía.

## Las reescrituras

De ese RC salieron al menos 9 reescrituras a lo largo de los años siguientes,
cada una intentando algo distinto. En los archivos viejos se conservan varias
de ellas, y se nota la evolución con cada intento:

- **`viejo`** — con su subcarpeta `codetext` (el primer "editor de código", el
  CLSCodeText) y su `desarrollo/` con una ayuda que lo resumía mejor que nadie:
  *"lenguaje de programación creado por un chico de 13 años"*. Aquí la sintaxis
  ya usaba `call` y módulos `.clsfrm`:

  ```batch
  call import button
  call import linecolor
  call main

  title prueba

  call linecolor 1c "Hola mundo"
  ```

  Había un shell interactivo con prompt `CLS#` que leía el programa y lo
  ejecutaba línea por línea, y la idea de los **módulos** (`.imp`) ya asomaba:
  `import` copiaba el contenido de un `.imp` a un `.bat` y lo llamaba.

- **`Nuevo RCFINAL`** — el intento de cerrar la etapa RC: un `deb.bat` mucho
  más grande (más de 21 KB), un `ls.src` con el "código fuente" del lenguaje,
  un `MenuBar.bat` que usaba `batbox.exe` para dibujar menús con el mouse, un
  instalador `CLSTUDIOS!1.0` y hasta registros `.reg` para integrarse con
  Windows. Aquí cada comando era `:_print`, `:_setmouse`... el lenguaje había
  madurado hacia una forma más ordenada de lo que fue el RC inicial.

- **`cls`** — un `deb.bat` que se describía como "shell a prueba de errores
  cls", una versión avanzada del shell con comandos directos:
  `print`, `input`, `integer`, `string`, y un mensaje de bienvenida que decía
  "version de cls avanzada".

- **`gra`** — el intento más ambicioso de la era Batch: **CLS gráfico**. Aquí
  el lenguaje cambia otra vez de cara, con `import Windows.Grafic`,
  `import Windows.Script`, y una sintaxis que ya parece un lenguaje de verdad:

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

  El truco de `gra` era más sofisticado: en vez de ejecutar solo en consola,
  el motor generaba un `.hta` —una aplicación HTML de Windows— y la lanzaba,
  abriendo la puerta a botones, imágenes, cuadros de diálogo e incluso VBScript
  incrustado. Entre sus pruebas quedó hasta un **Pong en VBScript**. Era el
  CLS más parecido a "una ventana de verdad" que existió en toda la era Batch.

## Por qué importa

Ese niño de 12 años no sabía escribir un compilador, ni siquiera sabía
probablemente qué era un lexer. Lo que sabía hacer era *golpear el teclado
hasta que algo funcionara*: una y otra vez, 9 veces por lo menos, construyendo
un lenguaje sobre las limitaciones de `cmd.exe` y aprendiendo —la mayoría de
las veces a base de fallar— qué era un comando, una variable, un bucle, un
módulo.

Todo eso que suena embarazoso visto con los ojos de hoy es, en realidad, el
origen de todo: la obsesión por los **módulos**, la idea de los **archivos
compilados**, el gusto por un **CLS que abriera ventanas**, y hasta el nombre
`.scls` que seguimos usando. Sin esas 9 reescrituras en Batch no existiría la
1.0.

## Lo que vino después

Esta era terminó cuando Frask descubrió que podía construir el mismo lenguaje
sobre algo mucho más sólido. El siguiente paso fue **Python** (`cls_py`,
`cls_py2.2`), y más tarde el puerto a **JavaScript** (`CLSJS`), que es el que
terminó viviendo dentro del repositorio de la 1.0–1.1. Esas dos etapas tienen
sus propios devlogs, pero la historia —la de verdad, la del niño y el `.bat`—
empieza aquí, el 20/02/2017.

---

*Siguiente: [CLS 1.0–1.1, el origen del lenguaje](/blog/devlog-1-0-1-1) — donde
la historia continúa años después, ya en Python.*
