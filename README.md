yalog... Yet Another Logger
===========

yalog is a Node.js logging library that can

* print log messages according to your own functions
* be customized per module and per logging level
* have any amount of logging levels
* print statements in full color (background too!!!)
* print statements with console qualities such as "italics" or "bold"
* print messages with module name and current line number so you know from where it was called
* be configured from file or by a module

Install
-----
```javascript
npm install yalog
```

Usage
-----
Add to your code:

```javascript
var log = require('yalog').with(module);
```

*module* is object defined automatically by Node.js.  This allows you to copy and paste the line into each file and leverage your filename.  The file name matching is done with ```module.id``` or the filename with the working directory and trailing '.js' removed. If you don't want automatic module names, replace it with your desired string name.

```javascript
var log = require('yalog').with("myCustomName");
```

Arguments are not inspected unless the log level allows for printing of the statement.  This avoids unnecessary object serialization calls before submitting your log statements.

```javascript
log.info(arg1, arg2, arg3);
```


Simple Example
--------------

```javascript
var log = require('yalog').with(module);
log.test( "Test"  , 0);
log.trace("Trace" , 1);
log.debug("Debug" , 2);
log.info( "Info"  , 3);
log.warn( "Warn"  , 4);
log.error("Error" , 5);
log.info('Array =', [1, 2, 3, 4], '; Object = ', {one: 1, two: 2});

// 2012-02-16T03:32:29.083Z TRACE main:23 - Trace 1
// 2012-02-16T03:32:29.085Z DEBUG main:24 - Debug 2
// 2012-02-16T03:32:29.085Z INFO  main:25 - Info 3
// 2012-02-16T03:32:29.085Z WARN  main:26 - Warn 4
// 2012-02-16T03:32:29.086Z ERROR main:27 - Error 5
// 2012-02-16T03:32:29.086Z INFO  main:28 - Array = [ 1, 2, 3, 4 ] ; Object =  { one: 1, two: 2 }
```


Advanced Example
---------------

Take a look at the [examples](http://github.com/schloerke/yalog/tree/master/examples) directory for different examples.

```javascript
// Load yalog configuration from another location to keep configurations in one spot.
var maxHelper = require('./examples/max_utilization_helper')
var log = maxHelper.with(module);

var answerObj = {is: 42};
answerObj.and = answerObj;

var ctxObj = {email: "jobs@metamarkets.com", circularObj: answerObj, other: "contextInfo", fn: function(){return true;}};
maxHelper.add_context_flag(ctxObj);

log.info( ctxObj, "The answer to life the universe and everything: '", answerObj, "'")
log.info( ctxObj, "Info counter should be at 2. Counter value:")
log.debug(ctxObj, "Debug counter should be at 1. Counter value:")
log.trace(ctxObj, "this should not execute. Level is not included (too low in stack)")
log.info( ctxObj, "Current 'ctxObj' obj: ", ctxObj)

// 2012-02-16T03:29:12.141Z; jobs@metamarkets.com; INFO ; main:12; -; The answer to life the universe and everything: ' | { is: 42, and: [Circular] } | '; 1
// 2012-02-16T03:29:12.145Z; jobs@metamarkets.com; INFO ; main:13; -; Info counter should be at 2. Counter value:; 2
// 2012-02-16T03:29:12.145Z; jobs@metamarkets.com; DEBUG; main:14; -; Debug counter should be at 1. Counter value:; 1
// 2012-02-16T03:29:12.145Z; jobs@metamarkets.com; INFO ; main:16; -; Current 'ctxObj' obj:  | { email: 'jobs@metamarkets.com', circularObj: { is: 42, and: [Circular] }, other: 'contextInfo', fn: [Function], _myContextFlag: true }; 3
```


[Changes](http://github.com/schloerke/yalog/blob/master/README.md)
-------

Dev Development
---------------

```bash
make compile  # compile files
make watch    # constantly watch files
```


[License](http://github.com/schloerke/yalog/blob/master/LICENSE.md)
-------
Released under MIT License. Enjoy and Fork!
