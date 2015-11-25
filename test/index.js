var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var before = lab.before;
var after = lab.after;
var it = lab.it;
var Code = require('code');
var expect = Code.expect;

var timers = require('timers');

var Queue = require('../');

describe('async-function-queue', function() {

  var q;

  it('can be created with no arguments', function(done) {
    Queue();
    done();
  });

  it('can be created with a concurrency argument', function(done) {
    q = Queue(2);
    done();
  });

  it('throws if you dont push a function', function(done) {
    expect(function() {
      q.push('hey');
    }).to.throw('push functions only');
    done();
  });

  it('concurrency is correct', function(done) {
    var concurrency = 0;
    var doneCount = 0;
    q.on('entry', onEntry);
    q.on('exit', onExit);
    q.once('drain', onDrain);

    q.push(wait(100));
    q.push(wait(100));
    q.push(wait(100));
    q.push(wait(100));

    function onEntry() {
      concurrency ++;
      expect(concurrency).to.be.most(2);
    }

    function onExit() {
      concurrency --;
      doneCount ++;
    }

    function onDrain() {
      expect(concurrency).to.equal(0);
      expect(doneCount).to.equal(4);
      done();
    }
  });

  it('can handle calling back with error', function(done) {
    q.push(function(cb) {
      timers.setTimeout(cb, 100, new Error('no way'));
    });

    q.once('error', function(err) {
      expect(err.message).to.equal('no way');
      done();
    });
  });

  function wait(ms) {
    return function(cb) {
      timers.setTimeout(cb, ms);
    };
  }

});

