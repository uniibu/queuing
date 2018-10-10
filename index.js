const EventEmitter = require('events');
class Queuing extends EventEmitter {
  constructor(options = {}) {
    super();
    this.concurrency = options.concurrency || Infinity;
    this.timeout = options.timeout || 0;
    this.autostart = options.autostart || false;
    this.results = options.results || null;
    this.retry = options.retry || false;
    this.delay = options.delay || 0;
    this.pending = 0;
    this.session = 0;
    this.calls = 0;
    this.running = false;
    this.jobs = [];
    this.timers = {};
    this._retryListen();
  }
  _retryListen() {
    const self = this;
    self.on('error', (err, job) => {
      if (self.retry) {
        self.jobs.push(job);
        self.emit('retry', err, job);
      }
    });
  }
  slice(begin, end) {
    this.jobs = this.jobs.slice(begin, end);
    return this;
  }
  reverse() {
    this.jobs.reverse();
    return this;
  }
  get length() {
    return this.pending + this.jobs.length;
  }
  start(cb) {
    if (cb) {
      this._callOnErrorOrEnd(cb);
    }
    this.running = true;
    if (this.pending >= this.concurrency) {
      return;
    }
    if (this.jobs.length === 0) {
      if (this.pending === 0) {
        this._done();
      }
      return;
    }
    const self = this;
    const job = this.jobs.shift();
    let once = true;
    const session = this.session;
    let timeoutId = null;
    let didTimeout = false;
    let resultIndex = null;
    function next(...args){
      if(self.delay){
        setTimeout(() => {
          _next(...args);
        }, self.delay);
      }else{
        _next(...args);
      }
    }
    function _next(err, result) {

      if (once && self.session === session) {
        once = false;
        self.pending--;
        if (timeoutId !== null) {
          delete self.timers[timeoutId];
          clearTimeout(timeoutId);
        }
        if (err) {
          self.emit('error', err, job);
        } else if (didTimeout === false) {
          if (resultIndex !== null) {
            self.results[resultIndex] = Array.prototype.slice.call(arguments, 1);
          }
          self.emit('success', result, job);
        }
        if (self.session === session) {
          if (self.pending === 0 && self.jobs.length === 0) {
            self._done();
          } else if (self.running) {
            self.start();
          }
        }
      }

    }
    if (this.timeout) {
      timeoutId = setTimeout(() => {
        didTimeout = true;
        if (self.listenerCount('timeout') > 0) {
          self.emit('timeout', next, job);
        } else {
          next();
        }
      }, this.timeout);
      this.timers[timeoutId] = timeoutId;
    }
    if (this.results) {
      resultIndex = this.results.length;
      this.results[resultIndex] = null;
    }
    this.pending++;
    const promise = job(next);
    if (promise && promise.then && typeof promise.then === 'function') {
      promise.then(result => {
        next(null, result);
      }).catch(err => {
        next(err || true);
      });
    }
    if (this.running && this.jobs.length > 0) {
      this.start();
    }
  }
  stop() {
    this.running = false;
  }
  end(err) {
    this._clearTimers();
    this.jobs.length = 0;
    this.pending = 0;
    this._done(err);
  }
  _clearTimers() {
    for (const key in this.timers) {
      const timeoutId = this.timers[key];
      delete this.timers[key];
      clearTimeout(timeoutId);
    }
  }
  _callOnErrorOrEnd(cb) {
    const self = this;
    this.once('error', self.end);
    this.once('end', err => {
      cb(err, self.results);
    });
  }
  _done(err) {
    this.session++;
    this.running = false;
    this.emit('end', err);
  }
}
const arrayMethods = ['pop', 'shift', 'indexOf', 'lastIndexOf'];
arrayMethods.forEach(method => {
  Queuing.prototype[method] = function (...args) {
    return Array.prototype[method].apply(this.jobs, args);
  };
});
const arrayAddMethods = ['push', 'unshift', 'splice'];
arrayAddMethods.forEach(method => {
  Queuing.prototype[method] = function (...args) {
    const methodResult = Array.prototype[method].apply(this.jobs, args);
    if (this.autostart) {
      this.start();
    }
    return methodResult;
  };
});
module.exports = opts => new Queuing(opts);