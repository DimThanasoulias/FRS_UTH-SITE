import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';

// Vite discovers the gallery at build time; scheduling does not depend on its files.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === 'virtual:show-images') return { url: 'data:text/javascript,export const SHOW_FILES=[]', shortCircuit: true };
  return nextResolve(specifier, context);
} });
const { WEEKLY_SCHEDULE_GR, WEEKLY_SCHEDULE_EN } = await import('../src/data/radioData.ts');
const events = JSON.parse(readFileSync(new URL('./fixtures/asura-week-2026-11-02.json', import.meta.url), 'utf8'));
const showIds: Record<number, string> = {
  12582: 'show-laz-and-stol', 12585: 'show-girls-next-door',
  12588: 'show-akoume-kai-den-krinoume', 12591: 'show-oso-boreis-entechna',
  12592: 'show-drink-n-roll', 12624: 'show-gkomenes-fanky',
  13102: 'show-all-panic-no-disco', 13143: 'show-masa-kai-arkoudios',
  13236: 'show-blonde-girls-gone-wild', 13447: 'show-argorythmoi',
};
const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const expected = events.map(event => {
  const start = new Date(event.start);
  const weekday = new Intl.DateTimeFormat('en-GB', {weekday:'short',timeZone:'Europe/Athens'}).format(start);
  return { id: showIds[event.id], day: weekdays.indexOf(weekday), time: `${event.start.slice(11,16)} - ${event.end.slice(11,16)}` };
});
// Editorial exception: retain High Fidelity even though it is absent from Asura.
expected.push({id: 'show-high-fidelity', day: 0, time: '20:00 - 21:00'});
expected.sort((a,b) => a.id.localeCompare(b.id));

for (const [language, schedule] of [['Greek', WEEKLY_SCHEDULE_GR], ['English', WEEKLY_SCHEDULE_EN]] as const) {
  test(`${language} visible schedule matches Asura plus the retained High Fidelity broadcast`, () => {
    const actual = schedule.flatMap((day, index) => day.shows.filter(show => !show.hidden).map(show => ({id:show.id, day:index, time:show.time}))).sort((a,b) => a.id.localeCompare(b.id));
    assert.deepEqual(actual, expected);
  });
}
