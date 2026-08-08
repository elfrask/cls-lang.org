# CMX (marcado)

CMX es el lenguaje de marcado de CLS, con sintaxis similar a JSX/HTML. Se usa
para describir estructuras de árbol (interfaces, componentes, documentos).

## Sintaxis

```clsx
var app = (
    <App titulo="Hola mundo" alHacerClick={() -> { print("click") }}>
        <Parrafo>Contenido</Parrafo>
        <Separador />
    </App>
);
```

- **Etiqueta de apertura**: `<Nombre atributo="valor" ...>`.
- **Etiqueta de cierre**: `</Nombre>`.
- **Auto-cierre**: `<Nombre />`.
- **Atributos**: `nombre="valor"` (cadena) o `nombre={expresión}`.
- **Hijos**: texto o elementos anidados.

## Modelo de datos

Al evaluar un elemento, se produce un `CmxValue`:

```rust
CmxValue {
    tag: String,
    props: Record<String, Value>,
    children: Array<Value>,
}
```

Se accede con `.tag`, `.props` y `.children`:

```clsx
print(app.tag);          # "App"
print(app.props.titulo); # "Hola mundo"
print(app.children[0].tag); # "Parrafo"
```

## Expresiones en atributos

Los atributos con `{...}` se evalúan como expresiones CLS:

```clsx
<Contador valor={contador + 1} />
```

## Texto y elementos anidados

```clsx
<div>
    Texto plano
    <span>anidado</span>
</div>
```

El texto y los hijos se convierten en valores; los elementos anidados se
convierten en `CmxValue` recursivamente.

## Implementación

El análisis de CMX ocurre en el lexer (que reconoce `<Tag ...>` como tokens de
marcado) y en el parser (`parse_cmx_element`), que produce una expresión
`Expression::Cmx`. El intérprete (`evaluate_cmx`) evalúa los atributos e hijos y
construye el `CmxValue`. El resaltado de la extensión de VS Code diferencia el
contexto CMX (tags de colores propios) del código y de los tipos.
