import { test } from 'node:test';
import assert from 'node:assert/strict';
import { persistApplication } from '../src/lib/persistApplication.ts';
const rejected = async () => { throw new Error('Store unavailable'); };
test('failed application writes reject instead of reporting success', async () => {
  await assert.rejects(persistApplication([rejected, rejected]));
});
test('accepts an application when either backing store saves it', async () => {
  let saved = false;
  await persistApplication([rejected, async () => { saved = true; }]);
  assert.equal(saved, true);
});
test('does not wait for an unavailable secondary store after a confirmed save', async () => {
  const result = await Promise.race([
    persistApplication([async () => 'saved', () => new Promise(() => {})]).then(() => 'saved'),
    new Promise(resolve => setTimeout(() => resolve('timeout'), 30)),
  ]);
  assert.equal(result, 'saved');
});
