

var log = require('./max_utilization_helper').with(module);

// // Can produce output with the following file and levels
// '*'          : ['error']
// 'main'       : ['debug', 'info', 'sql', req', 'warn', 'error']
// 'first_file' : ['trace', 'debug', 'info', 'sql', 'req' ,'warn', 'error']
// 'second_file': ['info', 'sql', 'req' ,'warn', 'error']
// 'custom_file': ['debug', 'sql', 'warn', 'error']   // <- does not follow traditional model!!!


var iden = function(d) {return d;};

                                                              // qualifiers to make it a 'req' object
var req = {session: { user: {email: "jobs@metamarkets.com" } } , route: {}, res: {}, next: iden};
var fourtyTwo = 42;
log.info(req, "The answer to life the universe and everything: '", fourtyTwo, "'")
// "2012-02-00T00:00:00.000Z; main; jobs@metamarkets.com; INFO ; main:18; The answer to life the universe and everything: '!¿!fourtyTwo!¿!'; 1"

log.info(req, "Info counter should be at 2. Counter value:")
// "2012-02-00T00:00:00.001Z; main; jobs@metamarkets.com; INFO ; main:21; Info counter should be at 2. Counter value:; 2"

log.debug(req, "Debug counter should be at 1. Counter value:")
// "2012-02-00T00:00:00.001Z; main; jobs@metamarkets.com; DEBUG; main:24; Debug counter should be at 1. Counter value:; 1"

log.trace(req, "this should not execute. Level is not included (too low in stack)")
//
