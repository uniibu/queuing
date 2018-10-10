const tape = require('./tape');
const queue = require('../');
tape('autostart', t => {
  t.plan(4);
  const expected = [['one', 'two'], ['one', 'two', 'three']];
  const actual = [];
  const q = queue({ autostart: true });
  let numEndHandlers = 0;
  q.on('end', () => {
    numEndHandlers++;
    t.equal(actual.length - 1, numEndHandlers);
    t.deepEqual(actual, expected[numEndHandlers - 1]);
  });
  q.push(cb => {
    actual.push('one');
    cb();
  });
  q.push(cb => {
    actual.push('two');
    cb();
  });
  setTimeout(() => {
    q.push(cb => {
      actual.push('three');
      cb();
    });
  }, 10);
});