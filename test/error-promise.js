const tape = require('tape');
const queue = require('../');
tape('error-promise with error', t => {
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
  q.push(() => new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('something broke'));
    }, 20);
  }));
  q.push(() => new Promise((resolve) => {
    setTimeout(resolve, 30);
  }));
  q.start();
});
tape('error-promise with empty error', t => {
  t.plan(2);
  const q = queue();
  q.on('error', q.end.bind(q));
  q.on('end', err => {
    t.equal(err, true);
    t.equal(q.length, 0);
  });
  q.push(cb => {
    setTimeout(cb, 10);
  });
  q.push(() => new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
    }, 20);
  }));
  q.push(() => new Promise((resolve, ) => {
    setTimeout(resolve, 30);
  }));
  q.start();
});