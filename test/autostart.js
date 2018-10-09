const tape = require('tape');
const queue = require('../');
tape('autostart', t => {
  t.plan(9);
  const expected = ['one', 'two', 'three'];
  const actual = [];
  const q = queue({ autostart: true });
  let numEndHandlers = 0;
  q.on('end', () => {
    numEndHandlers++;
    t.equal(actual.length, numEndHandlers);
    for (const i in actual) {
      t.equal(actual[i], expected[i]);
    }
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