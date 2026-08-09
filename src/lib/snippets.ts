export const HERO_SNIPPET = `
class Persona {
    var nombre: String;

    function main(nombre: String) {
        me.nombre = nombre;
    }

    function saludar() -> String {
        return "Hola, soy \${me.nombre}!";
    }
}

function main(args: String[]) -> int {
    var p = Persona("CLS");
    print(p.saludar());
    return 0;
}`;

export const PIPELINE_SNIPPETS = {
  lexer: `# token.clsx
function main() -> int {
    var x = 42;
    print(x);
    return 0;
}`,
  typeck: `var x = 42;       # Int
const PI = 3.14;  # literal type

alias Color = "red" | "green";

function duplicar(n: Int) -> Int {
    return n * 2;
}`,
  jit: `# .clsx -> ejecución JIT
clx run app.clsx
# JIT: CLS -> WASM -> wasmtime (dev)`,
} as const;
