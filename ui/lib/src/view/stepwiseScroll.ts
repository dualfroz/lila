export default function stepwiseScroll(
  scrollAction: (e: WheelEvent) => void,
  shouldSkip: (e: WheelEvent) => boolean,
  ifSkipShouldStillPreventDefault?: boolean,
): (e: WheelEvent) => void {
  let accumulatedDeltaPixelMode = 0;
  let accumulatedDeltaLineMode = 0;
  return (e: WheelEvent) => {
    if (e.ctrlKey) return; // if touchpad zooming, e.ctrlKey is true
    if (shouldSkip(e)) {
      if (ifSkipShouldStillPreventDefault) e.preventDefault();
      return;
    }
    e.preventDefault();
    if (e.deltaMode === 0) {
      accumulatedDeltaPixelMode += e.deltaY;
      if (Math.abs(accumulatedDeltaPixelMode) < 10) return;
    } else if (e.deltaMode === 1) {
      accumulatedDeltaLineMode += e.deltaY;
      if (Math.abs(accumulatedDeltaLineMode) < 3) return;
    }
    accumulatedDeltaPixelMode = 0;
    accumulatedDeltaLineMode = 0;
    scrollAction(e);
  };
}
