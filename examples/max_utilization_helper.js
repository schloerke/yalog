
var util = require('util');
var CTX_FLAG = "_myContextFlag";


function save_to_db(str) {
  // do stuff
}
function save_to_console(str) {
  util.puts(str);
  // do stuff
}
function save_to_file(str) {
  // do stuff
}


function my_log_hook_fn(str) {
  save_to_db(str);
  save_to_console(str);
  save_to_file(str);
}

function my_custom_counter(mod) {
  var levelCounterMap = {};
  function counter_by_level(level, args) {
    levelCounterMap[level] || (levelCounterMap[level] = 0);
    levelCounterMap[level]++;
    return levelCounterMap[level];
  }
  return counter_by_level;
}


function is_context_obj(obj) {
  if (toString.call(obj) == '[object String]' ) {
    return false;
  }
  return (obj != null ? obj[CTX_FLAG] : false) === true;
}

function single_line_message_without_context(opts) {
  var single_after_opts = yalog.helper.single_line_message(opts);
  return function(mod) {
    var single_after_mod = single_after_opts(mod);
    return function(level, args) {
      if (is_context_obj(args[0] || {})) {
        return single_after_mod(level, args.slice(1));
      } else {
        return single_after_mod(level, args);
      }
    };
  };
};

function ctx_email(opts) {
  return function(mod) {
    return function(level, args) {
      var reqObj;
      ctxObj = args[0] || {};
      if (is_context_obj(ctxObj)) {
        return (ctxObj != null ? ctxObj.email : void 0) || null;
      } else {
        return null
      }
    };
  };
};






var yalog = require('../index.js')
yalog.options(
  { color         : false           // true; to force color
  , logger        : my_log_hook_fn  // console.log
  , loggerContext : null            // console
  , separator     : '; '
  , fnArr:
      [ yalog.helper.iso_date()       // no options
      , ctx_email()                   // no options
      , yalog.helper.level()          // no options
      , yalog.helper.file_and_line()  // no options
      , "-"                           // plain string to always be inserted
      , single_line_message_without_context({separator: " | "})
      , my_custom_counter             // must execute on function that takes args ['module'], then on a function that takes args ['level', 'args']
      ]
  , logLevels:
    [ { title: "silly", color: "high_red", background: "cyan", attr: ["bold", "italic", "underline", "blink", "inverse", "hidden"]}
    , { title: "test" , color: "magenta"}
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
    , ["main", "debug"]
    , ["first_file", "trace"]
    , ["second_file", "info"]
    , ["custom_file", ["debug", "sql", "warn", "error"] ]
    ]
  }
);


exports.add_context_flag = function(obj) {
  obj[CTX_FLAG] = true;
}

exports.with = function(mod) {
  return yalog.with(mod);
};
