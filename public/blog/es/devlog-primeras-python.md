# Devlog: las primeras CLS en Python (`cls_py` y `cls_py2.2`)

*Publicado el 2019-09-15 por Equipo CLS*

En el [devlog anterior](/blog/devlog-origenes-batch) contamos cómo CLS nació
como un montón de archivos `.bat` dentro de `cmd.exe`, con su `goto ///end` y
sus comandos que eran etiquetas. Esa era terminó cuando su autor descubrió que
podía construir el mismo lenguaje sobre algo más sólido que el shell de
Windows. El siguiente intento fue **Python**.

## El salto a Python

Las implementaciones que se conservan de esta etapa son **`cls_py`** y
**`cls_py2.2`**, y muestran algo que no pasó con el Batch: esta vez el lenguaje
empezó a tener una sintaxis **propia**, con un lexer real y un generador de
código. Ya no era un `for /f` leyendo líneas con comillas como delimitador:
ahora había un `lex.py` de más de 70 KB que analizaba el código carácter por
carácter.

El modelo era el mismo del final: CLS se **transpilaba a Python**. El
`main.py` leía el `.scls`, lo pasaba por el lexer (`desline`) y luego
`void()` lo convertía en Python real:

```python
def main(script):
    l.void(l.desline(script.read()), "main")
```

Y dentro de `lex.py` vivía el corazón: `desline` (el lexer), `void` (el
traductor a Python) y `build` (el que armaba la salida). Aún no había clases,
módulos ni CMX — eso llegaría años después — pero las piezas ya estaban
formándose.

## La sintaxis

Los ejemplos que quedaron son pocos pero reveladores. Un "hola mundo" se veía
así:

```scls
include "std/cls.py"

fub main() {

	pr("hola mundo")

}
```

Fíjate en las palabras: **`include`** para cargar la biblioteca estándar,
**`fub`** para declarar funciones (una palabra que sobreviviría de forma
rara en versiones posteriores), **`pr`** para imprimir y las llaves `{}` para
los bloques. Ya no había `%variables%` de Batch ni `goto ///end`: esto ya se
parecía a un lenguaje de programación.

Un bucle sobre una lista:

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

Y el acceso a los argumentos de línea de comandos, que ya era parte del
lenguaje:

```scls
include "std/cls.py"

fub main() {

	pr(arg)

}
```

El lexer reconocía palabras clave de verdad: `include`, `import`, `fub`,
`class`, `func`, `if`, `else`, `elseif`, `while`, `for`, `loop`, `return`,
`global`, `as`, `or`, `and`. El lenguaje había empezado a pensar por sí mismo.

## La biblioteca estándar

Aquí aparece una de las partes más interesantes de esta etapa: la stdlib se
cargaba con `include "std/cls.py"`, y ese archivo definía el entorno del
lenguaje en forma de diccionarios — `clv` (funciones y valores globales) e
`impo` (módulos importables):

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

Ya existían cosas que luego veríamos evolucionar en la 1.0–1.1:

- **`system`** con `system.dir` (listar, crear, borrar carpetas),
  `system.filename` (crear, copiar, renombrar, eliminar archivos) y
  `system.run` para ejecutar comandos.
- **`get`** con utilidades como `get.arguments()`, `get.username()`,
  `get.ip()`, `get.osname()`.
- **`file`**, **`string`** (con `join`, `find`, `count`, `split`), y
  constructores tipados: `int`, `str`, `bool`, `list`, `char`, `ord`, `len`.
- **`clwintk`**: un intento de crear **ventanas** con `tkinter` desde CLS,
  con objetos `win` (título, icono, tamaño, `show()`).
- **`clson`**: un formato de datos tipo JSON, pero con la sintaxis de CLS —
  el ancestro lejano de lo que después sería el objeto compilado.
- **`pyengine("os")`**: la puerta de escape para importar librerías de Python
  directamente, como `pyengine("os").path.dirname(...)`.

## Las DLLs de CLS

Esta versión también tenía su propio sistema de "DLLs". El archivo
`cls32.dll` no era una DLL de Windows: era un paquete **pickle de Python** que
contenía el código de la consola serializado con unos metadatos. El generador
(`cls32_generate.py`) leía `meta.pyon`, un archivo de metadatos, y lo volcaba
en el `.dll`:

```python
dll = eval(str(open("meta.pyon").read()).replace("\n", ""))
pickle.dump(dll, open(os.path.dirname(os.getcwd()) + "/" + "cls32.dll", "wb"))
```

La forma de cargar esa "DLL" desde CLS era con `import`:

```scls
include "std/cls.py"

import get

fub main() {

	os = pyengine("os")
	pr(os.path.dirname(os.getcwd()))

}
```

Un detalle curioso: el `meta.pyon` de `cls_py` menciona una *edition* llamada
**"Plix-Compiler"** con autor "Carlos Pages" y compañía "SmallSoftWare" — el
seudónimo de la época. Y su metadato guarda una fecha: **15/9/2019**. Esa es
la huella que nos dice cuándo se escribió esta versión.

## `cls_py2.2`

La siguiente iteración, `cls_py2.2`, refinaba el motor. El `main.py` era más
simple y el `void` aceptaba el código de otra forma, preparando la
"ejecución avanzada". La sintaxis ya probaba más conceptos: `func`, `class`,
`global` y el `;` como terminador. Un archivo de prueba (`test.txt`) de esa
época lo muestra:

```scls
name = (23+2)/23;
global name;

func name() {

};

class name {
    kill = "final";
};
```

Aquí ya no estamos ante un Batch mejorado: es un lenguaje con funciones,
clases, variables globales y tipos. El salto cualitativo desde el RC de 2017
es enorme. Pero había un problema que se repetiría una y otra vez en la
historia de CLS: **el motor se quedaba corto**. Transpilar a Python y ejecutar
con `exec()` era funcional, pero cada intento de hacer el lenguaje "grande"
chocaba con los límites de esa arquitectura.

## El legado

`cls_py` y `cls_py2.2` fueron las primeras CLS de verdad: con lexer, con
sintaxis propia, con stdlib. De aquí salieron las semillas de todo lo que
vendría — `fub`, `include`, los tipos, el `pyengine` que después se convertiría
en el acceso a librerías, y la idea de un motor que transforma CLS en otro
lenguaje y lo ejecuta.

Pero el autor, para entonces un poco más crecido pero todavía inexperto,
seguía buscando. El siguiente paso no fue quedarse en Python: fue portar todo
ese motor a **JavaScript**, y esa implementación — `CLSJS` — terminó viviendo
dentro del repositorio de la 1.0–1.1. Esa historia tiene su propio devlog.

---

*Anterior: [los orígenes, CLS en Batch](/blog/devlog-origenes-batch) ·
Siguiente: [CLS 1.0–1.1, el origen del lenguaje](/blog/devlog-1-0-1-1).*
