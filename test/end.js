const tape = require('tape');
const queue = require('../');
tape('end', t => {
  t.plan(3);
  const q = queue();
  q.push(cb => {
    setTimeout(cb, 0);
  });
  q.push(cb => {
    setTimeout(() => {
      t.equal(q.length, 2);
      q.end(new Error('fake error'));
      setTimeout(() => {
        // session has changed so this should be a nop
        cb();
        // and we should still have one job left
        t.equal(q.length, 1);
      }, 10);
    }, 10);
  });
  q.push(cb => {
    setTimeout(cb, 30);
  });
  q.start(err => {
    t.equal(q.length, 0);
    if (err) {
      q.push(() => {});
    }
  });
});