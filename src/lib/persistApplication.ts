/** Success means at least one backing store acknowledged the submission. */
export async function persistApplication(writes: Array<() => Promise<unknown>>) {
  try {
    await Promise.any(writes.map(write => Promise.resolve().then(write)));
  } catch {
    throw new Error('Application could not be saved. Please try again.');
  }
}
