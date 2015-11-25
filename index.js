var EventEmitter = require('events').EventEmitter;

module.exports = createQueue;

function createQueue(_maxConcurrency) {
  var maxConcurrency = _maxConcurrency || 1;
  var ee = new EventEmitter();
  var q = [];
  var concurrency = 0;

  ee.push = push;
  return ee;

  function push(fn) {
    if((typeof fn) != 'function') {
      throw new Error('push functions only');
    }
    q.push(fn);
    maybeFlush();
  }

  function maybeFlush() {
    if (concurrency < maxConcurrency) {
      flush();
    }
  }

  function flush() {
    var fn = q.shift();
    if (fn) {
      concurrency ++;
      ee.emit('entry');
      fn.call(null, done);
    }
  }

  function done(err) {
    concurrency --;
    ee.emit('exit');
    if (err) {
      ee.emit('error', err);
    }
    if (! q.length && ! concurrency) {
      ee.emit('drain');
    }

    maybeFlush();
  }
}