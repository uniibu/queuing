const tape = require('./tape');
const queue = require('../');
tape('stop-sync', t => {
  t.plan(2);
  const q = queue({ concurrency: 1 });
  let n = 0;
  q.push(cb => {
    n++;
    q.stop();
    cb();
  });
  q.push(cb => {
    n++;
    cb();
  });
  q.start();
  setTimeout(() => {
    t.equal(q.length, 1);
    t.equal(n, 1);
  });
});