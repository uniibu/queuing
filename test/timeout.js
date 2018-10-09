const tape = require('tape');
const queue = require('../');
tape('timeout', t => {
  t.plan(4);
  const actual = [];
  const q = queue({ timeout: 10 });
  q.on('timeout', next => {
    t.ok(q);
    next();
  });
  q.on('end', () => {
    const expected = ['two', 'three'];
    t.equal(actual.length, expected.length);
    for (const i in actual) {
      const a = actual[i];
      const e = expected[i];
      t.equal(a, e);
    }
  });
  q.push(cb => {
    // forget to call cb
  });
  q.push(cb => {
    actual.push('two');
    cb();
  });
  q.push(cb => {
    actual.push('three');
    cb();
  });
  q.start();
});
tape('timeout auto-continue', t => {
  t.plan(3);
  const actual = [];
  const q = queue({ timeout: 10 });
  q.on('end', () => {
    const expected = ['two', 'three'];
    t.equal(actual.length, expected.length);
    for (const i in actual) {
      const a = actual[i];
      const e = expected[i];
      t.equal(a, e);
    }
  });
  q.push(cb => {
    // forget to call cb
  });
  q.push(cb => {
    actual.push('two');
    cb();
  });
  q.push(cb => {
    actual.push('three');
    cb();
  });
  q.start();
});
tape('unref timeouts', t => {
  t.plan(3);
  const q = queue({ timeout: 99999 });
  q.push(cb => {
    t.pass();
    // forget to call cb
  });
  q.start();
  q.stop();
  setTimeout(() => {
    t.equal(q.pending, 1);
    q.end();
    t.equal(q.pending, 0);
  }, 10);
});