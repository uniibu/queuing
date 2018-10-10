const tape = require('./tape');
const queue = require('../');
tape('error', t => {
  t.plan(2);
  const q = queue();
  q.on('error', q.end.bind(q));
  q.on('end', err => {
    t.equal(err.message, 'something broke');
    t.equal(q.length, 0);
  });
  q.push(cb => {
    setTimeout(cb, 10);
  });
  q.push(cb => {
    setTimeout(() => {
      cb(new Error('something broke'));
    }, 20);
  });
  q.push(cb => {
    setTimeout(cb, 30);
  });
  q.start();
});