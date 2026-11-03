import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isChristmasSeason } from '../src/lib/season.ts';
test('Christmas decorations start in November and end after January 6', () => {
  assert.equal(isChristmasSeason(10, 31), false);
  assert.equal(isChristmasSeason(11, 1), true);
  assert.equal(isChristmasSeason(11, 3), true);
  assert.equal(isChristmasSeason(12, 1), true);
  assert.equal(isChristmasSeason(1, 6), true);
  assert.equal(isChristmasSeason(1, 7), false);
});
test('admin overrides allow an early preview or disable seasonal decorations', () => {
  assert.equal(isChristmasSeason(11, 3, 'on'), true);
  assert.equal(isChristmasSeason(12, 25, 'off'), false);
});
