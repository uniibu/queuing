const tape = require('./tape');
const queue = require('../');
tape('error', t => {
  t.plan(2);
  const q = queue();
  q.push(cb => {
    cb(new Error('something broke'));
  });
  q.start(err => {
    t.equal(err.message, 'something broke');
    t.equal(q.length, 0);
  });
});