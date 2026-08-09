# Devlog: CLS 1.0–1.1, la versión que consolidó el lenguaje

*Publicado el 2025-06-10 por Equipo CLS*

Hoy toca hablar de las versiones 1.0 y 1.1. Pero antes, una aclaración que nos
debíamos: **no fueron la primera implementación de CLS**. Para cuando empezaron
a escribirse, el lenguaje ya había pasado por una larga serie de exploraciones
previas — el prototipo en [Batch](/blog/devlog-origenes-batch), las primeras
[implementaciones en Python](/blog/devlog-primeras-python) y el motor en
[JavaScript](/blog/devlog-clsjs). La 1.0 fue la primera versión **oficial y
numerada**, el punto donde el proyecto dejó de ser una serie de intentos y se
convirtió en algo que se podía versionar, publicar y usar.

## El punto de partida

CLS era entonces un proyecto personal, escrito **en Python**, que ya arrastraba
años de evolución. El propio README de esa época lo decía: *"it is a
programming language created for me as hobby in his startings. but with the
time this be convert in my project more ambitious"*. El arranque del CLI lo
resumía bien: *"Cls 1.1.1 - Build for win32 platforms, CLS 2016-2025"*, bajo la
marca *Vinestar Studio*. Fíjate en el "2016-2025": la fecha de inicio miraba
muy atrás, a aquellos primeros prototipos.

## Cómo funcionaba el motor

La versión 1.0–1.1 no era un intérprete clásico: era un **transpilador que
generaba código Python y lo ejecutaba con `exec()`**. Todo el motor vivía en un
solo archivo de unas 3600 líneas (`clsengine.py`) con una pipeline de seis
etapas:

1. `desline` — el lexer, que lee carácter a carácter.
2. `parselex` — agrupa `()`, `[]` y `{}`.
3. `estructuration` — reconoce cada tipo de sentencia del lenguaje.
4. `generator` — emite el código Python equivalente.
5. `jump` — une todo con la indentación correcta.
6. `exec` — ejecuta el Python generado.

No es casualidad que esos nombres te suenen: los heredó del motor
**CLSJS** en JavaScript, que ya usaba la misma pipeline
(`desline → parselex → estructuration → generator → jump → exec`). La 1.0–1.1
fue el regreso a Python con todo lo aprendido en el camino.

Las variables CLS se renombraban con el prefijo `var_` para no chocar con el
código generado, y la verificación de tipos se hacía en tiempo de ejecución.

## El lenguaje en 1.0–1.1

Ya en esta versión el lenguaje era sorprendentemente completo. Un vistazo a
`test.scls` muestra la mayoría de las características:

- Funciones tipadas con retorno: `function holabb() -> str`.
- Lambdas: `var FA = (xd) -> String { return xd + xd + xd; };`.
- `if` / `elif` / `else` y hasta **if-expressions**:
  `print(if (ask == "s") then ("es verdadero") else ("no es verdadero"))`.
- `switch` / `case` / `case default`, `while`, `for`, `for each` y `with`.
- `try` / `catch` para manejo de errores.
- **POO**: clases con constructor `function main()` (mapeado a `__init__`),
  `me` como `this`, herencia y visibilidad (`export`, `static`, `private`,
  `public`, `global`).
- `struct` con campos tipados y acceso por punto.
- `namespace` y módulos anidados:
  `module useModules { ... }; useModules.subModule.hi()`.
- `import` / `from` / `include` y plantillas (`template`).
- Arrays con métodos (`forEach`, `map`, `filter`, `push`) y diccionarios.
- Tipos especiales como `char`, `intbit` (enteros por bits), `hex`/`bin`/`oct`,
  booleanos (`true`/`false`/`on`/`off`) y `Promise` con `.then()` y `.catch()`.

Y por supuesto **CMX**, el marcado tipo JSX que sigue siendo parte de la
identidad del lenguaje:

```clsx
hola = <div>Hola mundo!</div>;
```

La biblioteca estándar ya cubría bastante: módulos `fs` (archivos, directorios,
lectura/escritura async con threads), `os` (procesos, variables de entorno) y
`http` con peticiones y promesas. Incluso tenía un huevo de pascua en la tabla
de códigos: el `418 im_a_teapot`.

## Los experimentos alrededor

La 1.0–1.1 fue también una época de muchos experimentos:

- **Casm**: un lenguaje tipo ensamblador con su propia VM de memoria lineal, que
  compilaba a `.cobj` o JSON.
- **CLSJS**: el puerto del motor a JavaScript que ya contamos en su propio
  [devlog](/blog/devlog-clsjs) — vivió dentro de este mismo repositorio.
- **Godot**: un transpilador de CLS a GDScript, con un juego de ejemplo.
- **CPKG**: un gestor de paquetes con cuenta de desarrollador y plantillas.
- **Brython**: experimentos para correr CLS directamente en la web.

## El problema

Con todo ese alcance, había un problema que se hacía cada vez más evidente:
**los tiempos de compilación eran muy grandes, incluso con archivos no muy
grandes**. Transpilar a Python y ejecutarlo con `exec()` no era un camino
rápido.

Esa fue la motivación para intentar una reescritura desde cero. Lo contamos en
el siguiente devlog.

---

*Versiones: [CLS 1.0–1.1](https://github.com/elfrask/cls/tree/1.0-1.1).*
