
// Load yalog configuration from another location to keep configurations in one spot.
var maxHelper = require('./max_utilization_helper')
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
