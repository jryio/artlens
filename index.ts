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

const mainImage = document.getElementById("main-image")
console.log({ mainImage });

// transform-origin: center, top left, etc.
// transform: (scale, translateX,Y,Z, rotate, etc.)
const transitionDelay = 1000

const transforms = [
  { transform: "scale(0.75)", transformOrigin: "left" },
  { transform: "scale(2)", transformOrigin: "right" },
  { transform: "scale(1)", transformOrigin: "top" },
]

// Loop through transitions
for (const [index, t] of transforms.entries()) {

  if (mainImage) {
    // Delay
    setTimeout(() => {
      mainImage.style.transformOrigin = t.transformOrigin
      mainImage.style.transform = t.transform
      mainImage.style.transitionDuration = "300ms"
      mainImage.style.transitionTimingFunction = "ease-in"
      console.log({ t })
    }, index * transitionDelay)
  }
}
