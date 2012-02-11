


try {
  var log = require('../index.js').options({
    file: "./file_utilization.json"
  }).with(module);
} catch (e) {
  // catch to help with execution path
  var log = require('../index.js').options({
    file: "./examples/file_utilization.json"
  }).with(module);

}


// // ./file.utilization.json
// {
//   "logLevels":
//   [ { "title": "test" , "color": "magenta"}
//   , { "title": "trace", "color": "cyan"   }
//   , { "title": "debug", "color": "blue"   }
//   , { "title": "info" , "color": "green"  }
//   , { "title": "sql"  , "color": "magenta"}
//   , { "title": "req"  , "color": "white"  }
//   , { "title": "warn" , "color": "yellow" }
//   , { "title": "error", "color": "red"    , "background": "yellow", "attr": ["bold", "underline"] }
//   ]

// , "fileLevels":
//   [ ["*", "error"]
//     ["main", "req"]
//     ["first_file", "trace"]
//     ["second_file", "info"]
//     ["custom_file", ["debug", "sql", "warn", "error"]]
//   ]
// }

// // Can produce output with the following levels
// '*'          : ['error']
// 'main'       : ['req', 'warn', 'error']
// 'first_file' : ['trace', 'debug', 'info', 'sql', 'req' ,'warn', 'error']
// 'second_file': ['info', 'sql', 'req' ,'warn', 'error']
// 'custom_file': ['debug', 'sql', 'warn', 'error']   // <- does not follow traditional model!!!

log.test( "Test"  , 0);
log.trace("Trace" , 1);
log.debug("Debug" , 2);
log.info( "Info"  , 3);
log.warn( "Warn"  , 4);
log.error("Error" , 5);
