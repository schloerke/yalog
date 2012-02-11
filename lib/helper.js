var arg_by_keys_wrapper, do_but_ignore_req_at_first, is_express_req_obj, item_by_keys, removeReturnsRegex, req_item_by_keys, util, _;
_ = require('underscore');
util = require('util');
is_express_req_obj = function(obj) {
  obj || (obj = {});
  return _.has(obj, "route") && _.has(obj, "res") && _.has(obj, "next");
};
item_by_keys = function(obj, keyArr) {
  var item, key, _i, _len;
  item = obj;
  for (_i = 0, _len = keyArr.length; _i < _len; _i++) {
    key = keyArr[_i];
    if (!_.has(item, key)) {
      return null;
    }
    item = item[key];
  }
  return item.toString();
};
arg_by_keys_wrapper = function(keyArr) {
  if (!keyArr) {
    throw "array is not supplied";
  }
  return function(mod) {
    return function(level, args) {
      return item_by_keys(args, keyArr);
    };
  };
};
req_item_by_keys = function(keyArr) {
  return function(mod) {
    return function(level, args) {
      var reqObj;
      reqObj = args[0] || {};
      if (!is_express_req_obj(reqObj)) {
        return null;
      }
      return item_by_keys(reqObj, keyArr);
    };
  };
};
exports.iso_date = function(opts) {
  if (opts == null) {
    opts = {};
  }
  return function(mod) {
    return function(level, args) {
      return (new Date()).toISOString();
    };
  };
};
exports.level = function(opts) {
  if (opts == null) {
    opts = {};
  }
  return function(mod) {
    return function(level, args, realTitle) {
      return realTitle;
    };
  };
};
exports.session_user_id = function(defArr) {
  if (defArr == null) {
    defArr = ["session", "user", "id"];
  }
  return req_item_by_keys(defArr);
};
exports.session_user_email = function(defArr) {
  if (defArr == null) {
    defArr = ["session", "user", "email"];
  }
  return req_item_by_keys(defArr);
};
exports.line_number = function(opts) {
  if (opts == null) {
    opts = {};
  }
  return function(mod) {
    return function(level, args) {
      try {
        throw new Error();
      } catch (e) {
        return e.stack.split('\n')[4].split(':')[1];
      }
    };
  };
};
exports.module_title = function(opts) {
  if (opts == null) {
    opts = {};
  }
  return function(mod) {
    return _.once(function(level, args, realTitle, moduleTitle) {
      if (!mod) {
        return '<unknown>';
      }
      if (!mod.id) {
        return mod;
      }
      if (mod.id === '.') {
        return 'main';
      } else {
        return mod.id.replace(process.env.PWD, "").replace(/.js$/, "").replace(/^\//, "");
      }
    });
  };
};
exports.file_and_line = function(opts) {
  if (opts == null) {
    opts = {};
  }
  return function(mod) {
    var line_fn, mod_title_fn;
    line_fn = exports.line_number(opts)(mod);
    mod_title_fn = exports.module_title(opts)(mod);
    return function(level, args) {
      return mod_title_fn(level, args) + ":" + line_fn(level, args);
    };
  };
};
removeReturnsRegex = /[^\\]\n/g;
exports.single_line_message = function(opts) {
  var depth, separator, showHidden;
  if (opts == null) {
    opts = {};
  }
  showHidden = opts.showHidden;
  depth = opts.depth;
  separator = opts.separator || "";
  return function(mod) {
    return function(level, args) {
      var item, ret, _i, _len, _ref;
      ret = [];
      _ref = args || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (_.isString(item)) {
          ret.push(item);
        } else {
          ret.push(util.inspect(item, showHidden, depth));
        }
      }
      ret = ret.join(separator);
      ret = ret.replace(removeReturnsRegex, '');
      return ret;
    };
  };
};
exports.message = function(opts) {
  var depth, separator, showHidden;
  if (opts == null) {
    opts = {};
  }
  showHidden = opts.showHidden;
  depth = opts.depth;
  separator = opts.separator || "";
  return function(mod) {
    return function(level, args) {
      var item, ret, _i, _len, _ref;
      ret = [];
      _ref = args || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (_.isString(item)) {
          ret.push(item);
        } else {
          ret.push(util.inspect(item, showHidden, depth));
        }
      }
      ret = ret.join(separator);
      return ret;
    };
  };
};
do_but_ignore_req_at_first = function(fn) {
  return function(opts) {
    var fn_after_opts;
    if (opts == null) {
      opts = {};
    }
    fn_after_opts = fn(opts);
    return function(mod) {
      var fn_after_mod;
      fn_after_mod = fn_after_opts(mod);
      return function(level, args) {
        args || (args = []);
        if (is_express_req_obj(args[0] || null)) {
          return fn_after_mod(level, args.slice(1));
        } else {
          return fn_after_mod(level, args);
        }
      };
    };
  };
};
exports.single_line_message_ignore_express_req_at_first = do_but_ignore_req_at_first(exports.single_line_message);
exports.message_ignore_express_req_at_first = do_but_ignore_req_at_first(exports.message);
exports.string = function(x) {
  return _.once(function(mod) {
    return _.once(function(level, args) {
      return x;
    });
  });
};