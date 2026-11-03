import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLoginRole, DEFAULT_ADMIN_PASSWORD, DEFAULT_PRODUCER_PASSWORD } from '../src/lib/loginCredentials.ts';

test('accepts the admin username with the unchanged admin password', () => {
  assert.equal(getLoginRole('admin', DEFAULT_ADMIN_PASSWORD), 'admin');
});
test('accepts the producer username with the unchanged producer password', () => {
  assert.equal(getLoginRole('producer', DEFAULT_PRODUCER_PASSWORD), 'producer');
});
test('rejects a correct password paired with the wrong or empty username', () => {
  assert.equal(getLoginRole('producer', DEFAULT_ADMIN_PASSWORD), null);
  assert.equal(getLoginRole('admin', DEFAULT_PRODUCER_PASSWORD), null);
  assert.equal(getLoginRole('', DEFAULT_ADMIN_PASSWORD), null);
  assert.equal(getLoginRole('someone', DEFAULT_PRODUCER_PASSWORD), null);
});
test('normalizes username casing and whitespace', () => {
  assert.equal(getLoginRole(' ADMIN ', DEFAULT_ADMIN_PASSWORD), 'admin');
});
test('rejects incorrect passwords', () => {
  assert.equal(getLoginRole('admin', 'incorrect'), null);
  assert.equal(getLoginRole('producer', ''), null);
});
