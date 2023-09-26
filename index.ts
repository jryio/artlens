/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Above are triple slash directives for the TypeScript compiler.
//
// Because bun.sh sets "types: ["bun-types]", the TypeScript compiler will use
// "bun-types" and ignore the DOM types we want to use.
//
// To get around this we use the triple slash directive to inform the compiler
// we also want DOM types.
//
// https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-lib-

console.log("Hello via Bun!");
