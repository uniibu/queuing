const tape = require('tape');
const queue = require('../');
tape('results', t => {
  t.plan(2);
  const q = queue({ results: [] });
  q.push(
    cb => {
      cb(null, 42);
    },
    cb => {
      cb(null, 3, 2, 1);
    },
    cb => {
      cb();
    }
  );
  q.unshift(cb => {
    setTimeout(() => {
      cb(null, 'string');
    }, 10);
  });
  q.start((err, results) => {
    t.error(err);
    t.deepEqual(results, [['string'], [42], [3, 2, 1], []]);
  });
});