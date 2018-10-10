const tape = require('./tape');
const queue = require('../');
tape('promises', t => {
  t.plan(4);
  const actual = [];
  const q = queue({ concurrency: 1 });
  q.on('end', () => {
    const expected = ['one', 'two', 'three'];
    t.equal(actual.length, expected.length);
    for (const i in actual) {
      const a = actual[i];
      const e = expected[i];
      t.equal(a, e);
    }
  });
  q.push(() => new Promise((resolve) => {
    actual.push('one');
    resolve();
  }));
  q.push(() => new Promise((resolve) => {
    actual.push('two');
    resolve();
  }));
  q.push(() => new Promise((resolve) => {
    actual.push('three');
    resolve();
  }));
  q.start();
});