# Estructuras de Control

## Funciones

```clsx
# Función con retorno
function add(a: Int, b: Int) -> Int {
    return a + b;
}

# Función void (sin retorno)
void log(msg: String) {
    print(msg);
}

# Función con parámetros por defecto
function greet(name: String, greeting: String = "Hello") -> String {
    return "$greeting, $name!";
}
```

## If / Elif / Else

```clsx
if (score >= 90) {
    print("A");
} elif (score >= 80) {
    print("B");
} else {
    print("C");
}
```

## Ternario

```clsx
var result = if (x > 0) then ("positive") else ("negative");
```

## While

```clsx
var i = 0;
while (i < 5) {
    print(i);
    i = i + 1;
}
```

## Loop (infinito)

```clsx
loop {
    # hacer algo...
    if (cond) {
        break;
    }
}
```

## For

```clsx
for (i = 0; i < 10; i = i + 1) {
    print(i);
}
```

## For Each

```clsx
# Iterar elementos
for each item in (array) {
    print(item);
}

# Iterar con índice
for each item and idx in (array) {
    print(idx, ":", item);
}
```

## Switch / Case

```clsx
switch (value) {
    case ("a") {
        print("opción a");
    }
    case ("b") {
        print("opción b");
    }
    case default {
        print("ninguna");
    }
}
```

## Try / Catch / Finally

```clsx
try {
    var result = riskyOperation();
} catch (e: Error) {
    print("Error:", e);
} finally {
    cleanup();
}
```

## With

```clsx
with connection in (openDb("localhost")) {
    connection.query("SELECT * FROM users");
}
```

## Return, Break, Continue

```clsx
return value;
break;
continue;
```
