# async-function-queue

[![By](https://img.shields.io/badge/made%20by-yld!-32bbee.svg?style=flat)](http://yld.io/contact?source=github-async-function-queue)
[![Build Status](https://secure.travis-ci.org/pgte/async-function-queue.svg?branch=master)](http://travis-ci.org/pgte/async-function-queue?branch=master)


Simple async function queue.

## Install

```
$ npm install async-function-queue --save
```

## Use

```js
var Queue = require('async-function-queue');

var concurrency = 2;

// create a queue, defining concurrency
var queue = Queue(concurrency);

// push a function that accepts a callback
// as sole argument
queue.push(function(cb) {
  setTimeout(cb, 1000);
});
```

### Events

```js
// Some emitted events

queue.on('entry', function() {
  console.log('starting to execute function');
});

queue.on('exit', function() {
  console.log('finished executing function');
});

queue.on('drain', function() {
  console.log('queue has drained');
});

```

## License

ISC