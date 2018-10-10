const tape = require('./tape');
const queue = require('../');
let retries = 0;

tape('retry', t => {
  t.plan(4);
  const q = queue({ retry: true });
  q.push(cb => {
    cb(new Error('something broke,back to que'));
  });
  q.push(cb => {
    cb(new Error('something broke,back to que'));
  });
  q.on('retry', err => {
    retries++;
    t.equal(err.message, 'something broke,back to que');
    t.equal(q.length, 2);
    if(retries == 2){
      q.end();
    }
    
  });
  q.start();
});