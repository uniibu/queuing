const tape = require('tape');
const queue = require('../');
tape('start', t => {
  t.plan(3);
  const q = queue();
  q.push(cb => {
    t.ok(q);
    cb();
  });
  q.start(() => {
    t.ok(q);
    q.start(() => {
      t.ok(q);
    });
  });
});