const tape = require('tape');
const queue = require('../');
tape('pop sync', t => {
  t.plan(2);
  const q = queue();
  const results = [];
  q.push(cb => {
    results.push(1);
    cb();
  });
  q.push(cb => {
    results.push(2);
    cb();
  });
  q.pop();
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [1]);
  });
});
tape('pop async', t => {
  t.plan(2);
  const q = queue({ concurrency: 1 });
  const results = [];
  q.push(cb => {
    results.push(1);
    setTimeout(cb, 10);
  });
  q.push(cb => {
    results.push(2);
    cb();
  });
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [1]);
  });
  q.pop();
});
tape('shift sync', t => {
  t.plan(2);
  const q = queue();
  const results = [];
  q.push(cb => {
    results.push(1);
    cb();
  });
  q.push(cb => {
    results.push(2);
    cb();
  });
  q.shift();
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [2]);
  });
});
tape('shift async', t => {
  t.plan(2);
  const q = queue({ concurrency: 1 });
  const results = [];
  q.push(cb => {
    results.push(1);
    setTimeout(cb, 10);
  });
  q.push(cb => {
    results.push(2);
    cb();
  });
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [1]);
  });
  q.shift();
});
tape('slice sync', t => {
  t.plan(3);
  const q = queue();
  const results = [];
  q.push(cb => {
    results.push(1);
    cb();
  });
  q.push(cb => {
    results.push(2);
    cb();
  });
  t.equal(q, q.slice(0, 1));
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [1]);
  });
});
tape('slice async', t => {
  t.plan(3);
  const q = queue({ concurrency: 1 });
  const results = [];
  q.push(cb => {
    results.push(1);
    setTimeout(cb, 10);
  });
  q.push(cb => {
    results.push(2);
    cb();
  });
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [1]);
  });
  t.equal(q, q.slice(0, 0));
});
tape('reverse sync', t => {
  t.plan(3);
  const q = queue();
  const results = [];
  q.push(cb => {
    results.push(1);
    cb();
  });
  q.push(cb => {
    results.push(2);
    cb();
  });
  t.equal(q, q.reverse());
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [2, 1]);
  });
});
tape('indexOf', t => {
  t.plan(3);
  const q = queue();
  const results = [];
  q.push(job);
  q.push(job);
  t.equal(q.indexOf(job), 0);
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [1, 2]);
  });

  function job(cb) {
    results.push(results.length + 1);
    cb();
  }
});
tape('lastIndexOf', t => {
  t.plan(3);
  const q = queue();
  const results = [];
  q.push(job);
  q.push(job);
  t.equal(q.lastIndexOf(job), 1);
  q.start(err => {
    t.error(err);
    t.deepEqual(results, [1, 2]);
  });

  function job(cb) {
    results.push(results.length + 1);
    cb();
  }
});