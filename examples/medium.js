
reqLog = require('../index.js').options({
  logLevels:
  [ { title: "test" , color: "magenta"}
  , { title: "trace", color: "cyan"   }
  , { title: "debug", color: "blue"   }
  , { title: "info" , color: "green"  }
  , { title: "sql"  , color: "magenta"}
  , { title: "req"  , color: "white"  }
  , { title: "warn" , color: "yellow" }
  , { title: "error", color: "red"    , background: "black", attr: ["bold", "underline"] }
  ]
, fileLevels:
  [ ["*", "error"]
  , ["main", "req"]
  , ["first_file", "trace"]
  , ["second_file", "info"]
  // , ["main", ["debug", "sql", "warn", "error"]] // swith this in for main for custom logging!
  ]

})

var log = reqLog.with("main");

// // Can produce output with the following file and levels
// '*'          : ['error']
// 'main'       : ['req', 'warn', 'error']
// 'first_file' : ['trace', 'debug', 'info', 'sql', 'req' ,'warn', 'error']
// 'second_file': ['info', 'sql', 'req' ,'warn', 'error']
// 'custom_file': ['debug', 'sql', 'warn', 'error']   // <- does not follow traditional model!!!
log.test( "Test"  , 0);
log.trace("Trace" , 1);
log.debug("Debug" , 2);
log.info( "Info"  , 3);
log.sql(  "Sql"   , 4);
log.req(  "Req"   , 5);
log.warn( "Warn"  , 6);
log.error("Error" , 7);
