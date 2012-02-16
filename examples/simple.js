
var log = require('../index.js').with(module);


// // Uses the default log levels and file levels
// config.defaultLogLevels = [
//   { title: 'test' , color: 'magenta'}
//   { title: 'trace', color: 'cyan'   }
//   { title: 'debug', color: 'blue'   }
//   { title: 'info' , color: 'green'  }
//   { title: 'warn' , color: 'yellow' }
//   { title: 'error', color: 'red'    , background: 'yellow', attr: ['bold', 'underline']}
// ]

// config.defaultFileLevels = [
//   ["*", "trace"]
// ]


// // All files will produce output with the following levels
// '*': ['trace', 'debug', 'info', 'warn', 'error']
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