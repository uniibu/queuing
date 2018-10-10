const tape = require('tape');
tape.onFailure(() => {
  process.exit(1);
});
module.exports = tape;