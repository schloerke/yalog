
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
