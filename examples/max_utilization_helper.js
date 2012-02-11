
var sys = require('sys');

function save_to_db(str) {
  // do stuff
}
function save_to_console(str) {
  sys.puts(str);
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


var yalog = require('../index.js')
yalog.options(
  { color         : false           // true; to force color
  , logger        : my_log_hook_fn  // console.log
  , loggerContext : null            // console
  , separator     : '; '
  , fnArr:
      [ yalog.helper.iso_date()           // no options
      , yalog.helper.session_user_email() // no options
      , yalog.helper.level()              // no options
      , yalog.helper.file_and_line()      // no options
      , "-"                             // plain string to always be inserted
      , yalog.helper.single_line_message_ignore_express_req_at_first({separator: " | "})
      , my_custom_counter               // must execute on function that takes args ['module'], then on a function that takes args ['level', 'args']
      ]

  , logLevels:
    [ { title: "silly", color: "red"    , background: "cyan", attr: ["bold", "italic", "underline", "blink", "inverse", "hidden"]}
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


exports.with = function(mod) {
  return yalog.with(mod);
};
