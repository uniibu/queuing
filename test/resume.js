const tape = require('./tape');
const queue = require('../');
tape('resume', t => {
  t.plan(16);
  const q = queue({ concurrency: 2 });
  let jobsToSet = 16;
  while (jobsToSet--) {
    q.push(cb => {
      setTimeout(() => {
        t.ok(q);
        cb();
      }, 10);
    });
  }
  // start
  q.start();
  // and stop somewhere in the middle of queue
  setTimeout(() => {
    q.stop();
    q.start();
  }, 30);
});