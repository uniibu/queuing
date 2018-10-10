const tape = require('./tape');
const queue = require('../');
tape('stop', t => {
  t.plan(6);
  const q = queue({ concurrency: 1 });
  q.push(cb => {
    setTimeout(() => {
      t.equal(q.running, false);
      cb();
      // restart
      setTimeout(() => {
        q.start(() => {
          t.ok(q);
        });
      }, 10);
    }, 10);
  });
  q.push(cb => {
    t.equal(q.running, true);
    cb();
  });
  // start
  q.start(err => {
    t.error(err);
    t.equal(q.running, false);
  });
  // but stop the q before the first job has finished
  setTimeout(() => {
    t.equal(q.length, 2);
    q.stop();
  }, 0);
});