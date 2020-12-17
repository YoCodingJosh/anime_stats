function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(fn, time, ...args) {
  await timeout(time);
  return fn(...args);
}
