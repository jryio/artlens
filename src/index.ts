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

import { SelectionHandler } from './selection.ts'

const mainImage = document.getElementById("main-image")
const selectionBox = document.getElementById("selection-box")
console.log({ mainImage, selectionBox })
if (mainImage && selectionBox) {
  const handler = new SelectionHandler(mainImage, selectionBox)
  handler.onEndSelection = (start, end, { x, y }) => {
    console.log("selection center", { x, y })

    const top = Math.min(start.y, end.y)
    const left = Math.min(start.x, end.x)
    const right = Math.max(start.x, end.x)
    const bottom = Math.max(start.y, end.y)
    const width = Math.abs(right - left)
    const height = Math.abs(bottom - top)

    const selectionRect = { width, height }
    const imgRect = mainImage.getBoundingClientRect()

    const scale = Math.min(imgRect.width / selectionRect.width, imgRect.height / selectionRect.height)

    const transformOrigin = `${x}px ${y}px`
    const transform = `scale(${scale})`
    console.log({ transformOrigin, transform })

    // const t = { transform: "scale(0.75)", transformOrigin: "left", minDuration: 300 }

    mainImage.style.transform = transform
    mainImage.style.transformOrigin = transformOrigin
    mainImage.style.transitionDuration = `500ms`
    mainImage.style.transitionTimingFunction = "linear"
  }
  // const scaleToFit = handler.getScaleToFit()
}

// TODO: Setup selection handlers on image

// transform-origin: center, top left, etc.
// transform: (scale, translateX,Y,Z, rotate, etc.)
const transitionDelay = 1000

/*
  Transform: { transform: string, transformOrigin: string, minDuration: int};
*/
const transforms = [
  { transform: "scale(0.75)", transformOrigin: "left", minDuration: 300 },
  { transform: "scale(2)", transformOrigin: "right", minDuration: 300 },
  { transform: "scale(1)", transformOrigin: "top", minDuration: 300 },
]



function nextTransition(idx: number, mainImage: HTMLElement) {
  let t = transforms[idx];
  mainImage.style.transformOrigin = t.transformOrigin
  mainImage.style.transform = t.transform
  mainImage.style.transitionDuration = `${t.minDuration}ms`;
  mainImage.style.transitionTimingFunction = "ease-in"
  setTimeout(() => {
    console.log({ t });
    // create callback accepting input for next transition
    let forward = () => {
      if (idx < transforms.length) {
        nextTransition(idx + 1, mainImage);
      }
    }
    let backward = () => {
      if (idx > 0) {
        nextTransition(idx - 1, mainImage);
      }
    }
    document.addEventListener("click", () => {
      removeEventListener("contextmenu", backward);
      forward();
    }
    );
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      removeEventListener("click", forward);
      backward();
    });

  }, t.minDuration)
}

if (mainImage) {
  // nextTransition(0, mainImage);
}


// Standard format for the transform for the computer
//  left,right,top maybe its not precise enough (or maybe that's all we need)
//      1. transform: scale | transformOrigin (x, y)
//      2. transform: duration make this configurable
//      3. some pattern for triggering the transition
//          -- duration of the transition should have no movement
//   4. can we go backwards with right click
//
// transitions movements
//
/*
      mainImage.style.transformOrigin = t.transformOrigin
      mainImage.style.transform = t.transform
      mainImage.style.transitionDuration = "300ms"
      mainImage.style.transitionTimingFunction = "ease-in"
*/
