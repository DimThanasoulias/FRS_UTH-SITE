import { test } from 'node:test';
import assert from 'node:assert/strict';
import { radioAudio } from '../src/lib/radioAudio.ts';
// The browser media boundary is simulated; callbacks exercise the real manager.
class FakeAudio extends EventTarget {
  static current: FakeAudio;
  src = ''; error: object | null = null; loads = 0; paused = true; volume = 1; preload = '';
  constructor() { super(); FakeAudio.current = this; }
  load() { this.loads++; this.error = null; }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
(globalThis as any).window = { location: { protocol: 'https:' } };
(globalThis as any).Audio = FakeAudio;
test('reports stream errors and clears the error when retrying', async () => {
  let error = false;
  (radioAudio.setCallbacks as any)(() => {}, () => {}, (failed: boolean) => { error = failed; });
  radioAudio.play();
  await Promise.resolve();
  FakeAudio.current.paused = true;
  FakeAudio.current.error = { code: 2 };
  FakeAudio.current.dispatchEvent(new Event('error'));
  assert.equal(error, true);
  radioAudio.play();
  await Promise.resolve();
  assert.equal(error, false);
  assert.equal(FakeAudio.current.loads, 2);
  assert.equal(radioAudio.isPlaying(), true);
  radioAudio.pause();
});
