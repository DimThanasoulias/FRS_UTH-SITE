import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { initializeApp, deleteApp } from 'firebase/app';
import { collection, connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc, terminate } from 'firebase/firestore';

// Refuse to run against a real Firebase project.
assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'Run using npm run test:rules');
const emulator = new URL(`http://${process.env.FIRESTORE_EMULATOR_HOST}`);
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(emulator.hostname));
const app = initializeApp({ projectId: 'demo-frs-chat', apiKey: 'demo-key' });
const db = getFirestore(app, 'ai-studio-foititikaradiosh-9e1b01a2-068d-4b9d-ae9c-9352141f9167');
connectFirestoreEmulator(db, emulator.hostname, Number(emulator.port));

after(async () => {
  await terminate(db);
  await deleteApp(app);
});

const gif = { mediaUrl: 'https://media.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif', mediaType: 'gif' };
const image = { mediaUrl: 'https://chat.example.com/chat_123.webp', mediaType: 'image' };

for (const [name, content] of [
  ['a text message', { text: 'Hello!' }],
  ['a GIF without a caption', { text: '', ...gif }],
  ['an image without a caption', { text: '', ...image }],
  ['an image with a caption', { text: 'Studio', ...image }],
] as const) {
  test(`allows ${name}`, async () => {
    const message = { user: 'Listener', ...content };
    const ref = doc(collection(db, 'messages'));
    await setDoc(ref, message);
    assert.deepEqual((await getDoc(ref)).data(), message);
  });
}

for (const [name, content] of [
  ['an empty message', { text: '' }],
  ['a missing media URL', { text: '', mediaType: 'gif' }],
  ['a missing media type', { text: '', mediaUrl: gif.mediaUrl }],
  ['an unsupported media type', { text: '', ...gif, mediaType: 'video' }],
  ['an empty media URL', { text: '', ...gif, mediaUrl: '' }],
  ['an insecure media URL', { text: '', ...gif, mediaUrl: 'http://example.com/image.gif' }],
  ['a script URL', { text: '', ...gif, mediaUrl: 'javascript:alert(1)' }],
  ['an inline data URL', { text: '', ...gif, mediaUrl: 'data:image/gif;base64,R0lGODlh' }],
  ['an oversized media URL', { text: '', ...gif, mediaUrl: `https://example.com/${'x'.repeat(2048)}` }],
  ['invalid media even with a caption', { text: 'Hello', ...gif, mediaUrl: '' }],
  ['a non-string caption', { text: 123, ...gif }],
  ['an oversized caption', { text: 'x'.repeat(501), ...gif }],
  ['an oversized username', { text: '', ...gif, user: 'x'.repeat(51) }],
] as const) {
  test(`rejects ${name}`, async () => {
    await assert.rejects(
      setDoc(doc(collection(db, 'messages')), { user: 'Listener', ...content }),
      { code: 'permission-denied' },
    );
  });
}
