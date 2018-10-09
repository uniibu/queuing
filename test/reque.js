const tape = require('tape');
const queue = require('../');
tape('reque', t => {
  t.plan(4);
  const q = queue({ reque: true });
  q.push(cb => {
    cb(new Error('something broke,back to que'));
  });
  q.push(cb => {
    cb(new Error('something broke,back to que'));
  });
  q.on('retry', err => {
    t.equal(err.message, 'something broke,back to que');
    t.equal(q.length, 2);
  });
  q.start();
});