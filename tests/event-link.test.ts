import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getEventLinkLabel } from '../src/lib/eventLink.ts';

test('Instagram events use Instagram labels in both languages', () => {
  const link = 'https://www.instagram.com/p/DfPiyyiK5Lk/';
  assert.equal(getEventLinkLabel(link, true), 'Δείτε την εκδήλωση στο Instagram');
  assert.equal(getEventLinkLabel(link, false), 'View Event on Instagram');
});

test('Facebook events retain Facebook labels', () => {
  assert.equal(getEventLinkLabel('https://www.facebook.com/events/123', true), 'Σελίδα Εκδήλωσης στο Facebook');
  assert.equal(getEventLinkLabel('https://fb.me/example', false), 'Facebook Event Page');
});

test('other or malformed URLs use a neutral label', () => {
  for (const link of ['https://example.com', 'invalid', 'https://instagram.com.example.com']) {
    assert.equal(getEventLinkLabel(link, false), 'View Event');
  }
});
