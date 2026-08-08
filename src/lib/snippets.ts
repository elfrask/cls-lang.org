export const HERO_SNIPPET = `# hola.clsx
# CLS compila a WebAssembly

import "math" as math;

enum Nivel {
    Bajo,
    Medio,
    Alto,
};

class Persona {
    var nombre: String;
    var nivel: Nivel;

    function main(nombre: String, nivel: Nivel) {
        me.nombre = nombre;
        me.nivel = nivel;
    }

    function saludar() -> String {
        return "Hola, soy \${me.nombre} (\${me.nivel})!";
    }
}

function main(args: String[]) -> int {
    var p = Persona("CLS", Nivel.Alto);
    print(p.saludar());
    print("sqrt(16) = \${math.sqrt(16)}");
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
  wasm: `# .clsx -> .clbin (WASM)
clx build app.clsx
clx run --jit app.clsx
# JIT: CLS -> WASM -> wasmtime`,
} as const;

export const STDLIB_MODULES = [
  { name: "math", desc: "sqrt, pow, sin, random, PI, E…" },
  { name: "json", desc: "parse, stringify" },
  { name: "async", desc: "delay, all, race" },
  { name: "fs", desc: "readFile, writeFile, listDir…" },
  { name: "http", desc: "get, post" },
  { name: "primitive", desc: "upper, trim, join, indexOf…" },
] as const;
