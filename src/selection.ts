import { Option } from './util.ts'

type Position = {
  x: number,
  y: number
}

enum SelectionState {
  None,
  Selecting
}


export class SelectionHandler {
  box: HTMLElement;
  target: HTMLElement;
  self: SelectionHandler;
  start: Option<Position>
  end: Option<Position>
  absStart: Option<Position>
  absEnd: Option<Position>
  translate: Option<{ dx: number, dy: number, }>
  selectionState: SelectionState

  onEndSelection: Option<(start: Position, end: Position, center: Position) => void>

  constructor(target: HTMLElement, box: HTMLElement) {
    this.self = this
    this.box = box
    this.target = target
    this.selectionState = SelectionState.None;

    this.setHandlers()
    console.log("new SelectionHandler")
  }

  setHandlers(): void {
    const { self, target, box } = this
    target.addEventListener("pointerdown", self.startSelection.bind(self))
    target.addEventListener("pointermove", self.updateSelection.bind(self))
    target.addEventListener("pointerup", self.endSelection.bind(self))
    target.addEventListener("mouseup", self.endSelection.bind(self))
    target.addEventListener("pointercancel", self.endSelection.bind(self))

    // Prevent dragging the entire image
    target.addEventListener("dragstart", (e) => e.preventDefault())
    // Prevent scrolling off screen while dragging on mobile
    target.addEventListener("touchstart", (e) => e.preventDefault())

  }

  computeRect(start: Position, end: Position): void {
    const { self } = this
    if (!start || !end) { return }
    const { x: x1, y: y1 } = start
    const { x: x2, y: y2 } = end

    const top = Math.min(y1, y2)
    const left = Math.min(x1, x2)
    const right = Math.max(x1, x2)
    const bottom = Math.max(y1, y2)
    const width = Math.abs(right - left)
    const height = Math.abs(bottom - top)

    console.log('compute rect', { top, left, right, bottom, width, height })

    self.box.style.left = `${left}px`
    self.box.style.top = `${top}px`
    self.box.style.width = `${Math.abs(right - left)}px`
    self.box.style.height = `${Math.abs(bottom - top)}px`
  }

  clearRect(): void {
    const { self } = this
    self.box.style.left = ""
    self.box.style.top = ""
    self.box.style.width = ""
    self.box.style.height = ""
  }

  // MouseDown
  startSelection(event: PointerEvent): void {
    event.preventDefault()
    console.log({ event })
    const { self } = this
    if (event.button !== 0) { return }
    self.selectionState = SelectionState.Selecting
    self.box.hidden = false
    self.start = { x: event.offsetX, y: event.offsetY }

    self.target.style.userSelect = 'none'; // if there's text
    self.target.style.webkitUserSelect = 'none'; // safari
    self.target.setPointerCapture(event.pointerId)
  }

  // MouseMove
  updateSelection(event: MouseEvent): void {
    event.preventDefault()
    const { self } = this
    if (self.selectionState === SelectionState.None) { return }
    self.end = { x: event.offsetX, y: event.offsetY }
    self.computeRect(self.start!, self.end!)
  }

  // MouseUp
  endSelection(event: MouseEvent): void {
    const { self, start, end } = this
    self.selectionState = SelectionState.None
    // self.start = undefined
    // self.end = undefined
    self.box.hidden = true
    self.clearRect()

    self.target.style.userSelect = 'none'; // if there's text
    self.target.style.webkitUserSelect = 'none'; // safari
    console.log("endSelection", { event, self })
    const center = self.getSelectionCenter()
    if (!start || !end || !center || !self.onEndSelection) { return }
    self.onEndSelection(start, end, center)
  }

  getSelectionCenter(): Option<Position> {
    const { start, end } = this
    if (!start || !end) { return }

    const top = Math.min(start.y, end.y)
    const left = Math.min(start.x, end.x)
    const right = Math.max(start.x, end.x)
    const bottom = Math.max(start.y, end.y)

    const width = Math.abs(right - left)
    const height = Math.abs(bottom - top)

    const center = { x: start.x + (width / 2), y: start.y + (height / 2) }


    // const center = { x: start.x + ((start.x + end.x) / 2), y: start.y + ((start.y + end.y) / 2) }
    return center
  }
}
