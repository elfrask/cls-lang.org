# Devlog: CLSJS, el motor en JavaScript

*Publicado el 2022-02-08 por Equipo CLS*

Tras las primeras CLS en Python ([cls_py y cls_py2.2](/blog/devlog-primeras-python)),
el autor siguió buscando. En lugar de quedarse en Python, decidió portar todo el
motor a **JavaScript**. Esa implementación se llamó **CLSJS**, se desarrolló a
finales de 2020 y se terminó el 8 de febrero de 2022. Y aunque hoy viva
escondida dentro del repositorio de la 1.0–1.1, fue una de las etapas más
importantes de la historia del lenguaje.

## Qué era CLSJS

CLSJS era el motor de CLS reescrito **desde cero en JavaScript** — un único
`CLSJS.js` de más de 100 KB (~2600 líneas). Conservaba la idea del motor
Python (un transpilador que convierte CLS en otro lenguaje y lo ejecuta), pero
ahora el destino era **JavaScript** en vez de Python, y podía correr en dos
lugares a la vez:

- **En Node.js**, como CLI que leía un `.scls`, lo transpilaba y ejecutaba el
  `.js` resultante.
- **En el navegador**, compilando y ejecutando CLS directamente en una página
  web.

## El motor

La pipeline era la misma familia que la del motor Python, pero con nombres que
marcaron al motor de la 1.0–1.1 (y que veríamos repetirse después):

```javascript
let app = aplicacion.Script(data, g);
let d_crudo = app.desline(data)          // lexer
let parseado = app.parselex(d_crudo)     // agrupa () [] {} <>
let estructurado = app.estructuration(parseado)  // reconoce sentencias
let generado = app.generator(estructurado, "normal")  // emite JS
let salida = app.jump(generado, 0)       // une con indentación
app.exec(salida)                          // eval
```

Un detalle importante: los nombres `desline`, `parselex`, `estructuration`,
`generator` y `jump` — el vocabulario interno del motor — ya existían aquí, en
JavaScript. Esos mismos términos fueron los que después describirían al motor
de la 1.0–1.1. CLSJS fue el puente.

Las variables se renombraban con el prefijo `var_` (igual que después en
Python), los tipos de la librería vivían en un objeto `Api` (`String`,
`Integer`, `Float`, `Array`, `Function`, `Module`), y la ejecución terminaba
siendo un `eval` del código generado envuelto en un `try/catch` que reportaba
el error con su número de línea:

```javascript
app.index = 25
try {
    var_ )
} catch (e) {
    app.error(e, 'ErrorExec', 25)
}
```

## La sintaxis en CLSJS

La sintaxis que llegaría a la 1.0–1.1 empezó a tomar forma aquí. El
`app.scls` de la demo web muestra la mayoría de las piezas:

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

Ahí están:

- **`import` / `from ... import ... as ...`** para módulos.
- **Funciones tipadas con flecha**: `function main(argv:Array) -> void`.
- **`print`** como salida.
- Acceso al **sistema operativo** (`os.pid`, `os.osname`), lo que antes era el
  `pyengine("os")` de Python.
- Y la firma de la época: *"CLS Console - Frask - Vinestar (2021)"*.

El lexer ya tenía su lista de palabras reservadas, que son las que conocemos de
la 1.0–1.1:

```javascript
"class", "function", "async", "def", "method", "func", "fub", "module",
"namespace", "sync", "with", "import", "private", "public", "export",
"static", "from", "include", "if", "while", "for", "using", "var", "as", "try"
```

Y el generador ya sabía emitir **clases** con visibilidad (`public`,
`private`, `export`, `static`), con `me` como `this`, el objeto `private`,
los exports de la clase y los constructores por defecto — el mismo diseño que
luego veríamos en el motor Python de la 1.0–1.1.

## CLS en el navegador

Lo más ambicioso de CLSJS era correr CLS en la web. El motor detectaba si
estaba en Node o en el navegador (con `this.require`): en Node usaba
`process.pid` y `process.platform`; en la web inventaba un PID aleatorio y
ponía `osname = "web"`.

La página de demo lo cargaba así — un script CLS nativo en HTML:

```html
<script src="../CLSJS.js"></script>

<div id="_ccls"></div>

<script type="cls/script" src="app.scls"></script>
```

En el arranque, CLSJS buscaba todas las etiquetas `<script type="cls/script">`,
las compilaba una a una (respetando el atributo `async`) y las ejecutaba sobre
el DOM. CLS corría en el navegador sin transpilación previa: la propia web
ejecutaba CLS. También existía un **`openserver.js`** con Express que servía el
motor en el puerto `2020`, para cargar `CLSJS.js` y sus módulos desde una
página.

## CMX y el mapa

Fue en CLSJS donde el marcado tipo JSX — **CMX** — apareció por primera vez.
El `test.scls` de la carpeta lo prueba:

```clsx
hola = <div>
        Hola mundo!
    </div>;
```

Y al compilar, el motor generaba dos archivos: el `.js` ejecutable y un
`.map` con el árbol estructurado. En ese mapa ya aparece el token `"cml"`
(CMX) como un tipo de dato de primera clase:

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

## El legado

CLSJS no llegó a ser "la versión oficial" de CLS por sí sola: cuando la
implementación en Python de la 1.0–1.1 tomó protagonismo, el motor JS quedó
como un experimento dentro del mismo repositorio. Pero su importancia es
enorme:

- Consolidó la **sintaxis** moderna del lenguaje (imports, funciones tipadas,
  clases con visibilidad, CMX).
- Fijó el **vocabulario interno del motor** (`desline`, `parselex`,
  `estructuration`, `generator`, `jump`).
- Probó que CLS podía correr **en la web**, un objetivo que volvería a
  aparecer una y otra vez (WASM, backend portable, JIT) hasta la 2.0.

Como siempre en esta historia, el autor seguía siendo un programador
aprendiendo a los golpes: cada implementación le enseñaba algo que la
siguiente aprovechaba. CLSJS fue la que demostró que el lenguaje podía vivir
en más de un lugar a la vez.

Y fue justo después de esto cuando el autor se sentó a escribir la versión que
finalmente llamaría 1.0. Esa es la siguiente historia.

---

*Anterior: [las primeras CLS en Python](/blog/devlog-primeras-python) ·
Siguiente: [CLS 1.0–1.1, la versión que consolidó el lenguaje](/blog/devlog-1-0-1-1).*
