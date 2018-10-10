const tape = require('./tape');
const queue = require('../');
tape('synchronous', t => {
  t.plan(2);
  const actual = [];
  const q = queue({ concurrency: 1 });
  q.on('end', () => {
    const expected = ['three', 'one', 'two'];
    t.equal(actual.length, expected.length);
    t.deepEqual(actual, expected);
  });
  q.push(cb => {
    actual.push('three');
    cb();
  });
  q.push(cb => {
    actual.push('one');
    cb();
  });
  q.push(cb => {
    actual.push('two');
    cb();
  });
  q.start();
});