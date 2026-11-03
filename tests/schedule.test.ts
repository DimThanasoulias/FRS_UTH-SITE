import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getBroadcastSchedule } from '../src/lib/schedule.ts';
const show = (id: string, time: string) => ({ id, title: id, time, host: '', tags: [] });
const schedule = [
  { day: 'Mon', fullName: 'Monday', shows: [show('overnight', '23:00 - 02:00')] },
  { day: 'Tue', fullName: 'Tuesday', shows: [show('evening', '18:00 - 20:00')] },
];
test('uses Athens time rather than visitor timezone', () => {
  assert.equal(getBroadcastSchedule(schedule, false, new Date('2026-11-03T16:30:00Z')).currentLiveShow?.id, 'evening');
});
test('continues the previous day broadcast after midnight', () => {
  assert.equal(getBroadcastSchedule(schedule, false, new Date('2026-11-02T23:30:00Z')).currentLiveShow?.id, 'overnight');
});
test('ends overnight broadcasts at the exact end time', () => {
  assert.equal(getBroadcastSchedule(schedule, false, new Date('2026-11-03T00:00:00Z')).currentLiveShow, null);
});
test('finds the next broadcast when no show is live', () => {
  assert.equal(getBroadcastSchedule(schedule, false, new Date('2026-11-03T12:00:00Z')).nextShow?.id, 'evening');
});
