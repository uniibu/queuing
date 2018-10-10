const tape = require('./tape');
const queue = require('../');
tape('delay', t => {
  t.plan(2);
  let time;
  const actual = [];
  const expected = ['one', 'two'];
  const q = queue({ delay: 200, concurrency: 1 });
  q.on('end', () => {
    t.ok((Date.now() - time) >= 400);
    t.deepEqual(actual, expected);
  });
  q.push((cb) => {
    actual.push('one');
    cb();
  });
  q.push((cb) => {
    actual.push('two');
    cb();
  });
  time = new Date();
  q.start();
});