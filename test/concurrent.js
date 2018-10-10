const tape = require('./tape');
const queue = require('../');
tape('concurrent', t => {
  t.plan(2);
  const actual = [];
  const q = queue();
  q.concurrency = 2;
  q.push(cb => {
    setTimeout(() => {  
      actual.push('two');
      cb();
    }, 20);
  });
  q.push(cb => {
    setTimeout(() => {      
      actual.push('one');
      cb();
    }, 0);
  });
  q.push(cb => {
    q.concurrency = 1;
    setTimeout(() => {
      actual.push('three');
      cb();
    }, 30);
  });
  q.push(cb => {
    setTimeout(() => {
      actual.push('four');
      cb();
    }, 10);
  });
  q.push(cb => {
    setTimeout(() => {
      actual.push('five');
      cb();
    }, 0);
  });
  
  q.start(() => {
    const expected = ['one', 'two', 'three', 'four', 'five'];
    t.equal(actual.length, expected.length);
    t.deepEqual(actual, expected);

  });
});