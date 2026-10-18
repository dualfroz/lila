import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import stepwiseScroll from '../src/view/stepwiseScroll';

const wheel = (deltaY: number, deltaMode = 0) =>
  ({ deltaY, deltaMode, ctrlKey: false, preventDefault() {} }) as unknown as WheelEvent;

function countSteps(deltas: number[], deltaMode = 0) {
  let steps = 0;
  const onWheel = stepwiseScroll(
    () => steps++,
    () => false,
  );
  for (const deltaY of deltas) onWheel(wheel(deltaY, deltaMode));
  return steps;
}

describe('stepwiseScroll', () => {
  test('small pixel deltas accumulate before stepping', () => {
    assert.equal(countSteps([2, 2, 2, 2, 2]), 1);
    assert.equal(countSteps([-3, -3, -3, -3]), 1);
  });

  test('fractional line deltas of a high-resolution wheel accumulate to one step per notch', () => {
    assert.equal(countSteps([1.5, 0.375, 0.375, 0.375, 0.375], 1), 1);
    assert.equal(countSteps([1.5, 0.375, 0.375, 0.375, 0.375, 1.5, 0.375, 0.375, 0.375, 0.375], 1), 2);
    assert.equal(countSteps([-1.5, -0.375, -0.375, -0.375, -0.375], 1), 1);
  });

  test('one step per notch of a regular mouse wheel', () => {
    assert.equal(countSteps([100, 100, 100]), 3);
    assert.equal(countSteps([-100, -100]), 2);
    assert.equal(countSteps([3, 3, 3], 1), 3);
  });
});
