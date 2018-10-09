const tape = require('tape');
const queue = require('../');
tape('synchronous', t => {
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
  q.push(cb => {
    actual.push('three');
    cb();
  });
  q.unshift(cb => {
    actual.push('one');
    cb();
  });
  q.splice(1, 0, cb => {
    actual.push('two');
    cb();
  });
  q.start();
});