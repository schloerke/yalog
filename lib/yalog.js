var add_levels_to_status, color, config, fs, helper, status, sys, _, _ref;
var __slice = Array.prototype.slice;
sys = require('sys');
fs = require('fs');
_ = require('underscore');
config = require('./config');
color = require('./color');
helper = require('./helper');
exports.helper = helper;
exports._status = status = {
  logger: sys.puts,
  loggerContext: sys,
  file: null,
  color: ((_ref = process.env.TERM) != null ? _ref.indexOf('color') : void 0) >= 0,
  separator: " ",
  fnArr: [
    helper.iso_date(), helper.session_user_email(), helper.level(), helper.file_and_line(), helper.string("-"), helper.message_ignore_express_req_at_first({
      separator: " "
    })
  ]
};
add_levels_to_status = function(_arg) {
  var fileLevels, logLevels, parsedDefaults, _ref2;
  _ref2 = _arg != null ? _arg : {}, logLevels = _ref2.logLevels, fileLevels = _ref2.fileLevels;
  parsedDefaults = config.parse({
    logLevels: logLevels,
    fileLevels: fileLevels
  });
  status.logLevels = parsedDefaults.logLevels;
  status.parsedLogLevels = parsedDefaults.parsedLogLevels;
  status.fileLevels = parsedDefaults.fileLevels;
  status.colorMap = parsedDefaults.colorMap;
  status.fileLevelMap = parsedDefaults.fileLevelMap;
  status.defaultLogLevel = _.first(status.logLevels).title;
};
add_levels_to_status();
exports.options = function(opts) {
  var fileData, fileDataString, fnPos, item, _len, _ref2;
  if (_.has(opts, "logger") || _.has(opts, "loggerContext")) {
    if (!_.has(opts, "logger")) {
      throw "'logger' not supplied. Must be a function to match the 'loggerContext' (which may have a value of null)";
    }
    if (!_.has(opts, "loggerContext")) {
      throw "'loggerContext' not supplied. A logger context must be supplied to avoid errors.  Ex. yalog.opts({logger: console.log, loggerContext: console})";
    }
    status.logger = opts.logger;
    status.loggerContext = opts.loggerContext;
  }
  if (_.has(opts, "color")) {
    status.color = opts.color;
  }
  if (_.has(opts, "separator")) {
    status.separator = opts.separator;
  }
  if (_.has(opts, "file")) {
    status.file = opts.file;
    fileDataString = fs.readFileSync(opts.file);
    fileData = JSON.parse(fileDataString);
    status.logLevels = fileData.logLevels;
    status.fileLevels = fileData.fileLevels;
  } else {
    if (_.has(opts, "logLevels")) {
      status.logLevels = opts.logLevels;
    }
    if (_.has(opts, "fileLevels")) {
      status.fileLevels = opts.fileLevels;
    }
  }
  if (_.has(opts, "fnArr")) {
    status.fnArr = opts.fnArr;
    _ref2 = status.fnArr;
    for (fnPos = 0, _len = _ref2.length; fnPos < _len; fnPos++) {
      item = _ref2[fnPos];
      if (_.isString(item)) {
        (function(item) {
          return status.fnArr[fnPos] = _.once(function() {
            return _.once(function() {
              return item;
            });
          });
        })(item);
      } else if (_.isFunction(item)) {
        null;
      } else {
        throw "function at position '" + fnPos + "' is not a string that matches a helper method name or a function defined by you";
      }
    }
  }
  add_levels_to_status({
    logLevels: status.logLevels,
    fileLevels: status.fileLevels
  });
  return exports;
};
exports["with"] = function(mod) {
  var has_level, levelInfo, logFn, loggerContext, moduleLevelMap, moduleTitle, ret, separatorItem, _fn, _i, _len, _ref2;
  moduleTitle = helper.module_title({})(mod)();
  moduleLevelMap = status.fileLevelMap[moduleTitle] || status.fileLevelMap['*'];
  if (moduleLevelMap == null) {
    throw "No levels found for module: '" + moduleTitle + "'.  Please add the default file level of '*' or one that matches the module name.";
  }
  has_level = function(lvl) {
    return !(!moduleLevelMap[lvl]);
  };
  logFn = status.logger;
  loggerContext = status.logger;
  separatorItem = status.separator;
  ret = {
    _inColor: status.color,
    _title: moduleTitle,
    _logLevels: status.logLevels,
    _moduleLevels: _.keys(moduleLevelMap),
    _has_level: has_level,
    _separator: separatorItem,
    _logFn: logFn,
    _loggerContext: loggerContext
  };
  _ref2 = status.parsedLogLevels;
  _fn = function(levelInfo) {
    var ansiColorEnd, ansiColorStart, fn, level, levelFns;
    level = levelInfo.rawTitle;
    if (!_.isFunction(logFn)) {
      ret[level] = _.identity;
      return;
    }
    if (!moduleLevelMap[level]) {
      ret[level] = _.identity;
      return;
    }
    levelFns = (function() {
      var _j, _len2, _ref3, _results;
      _ref3 = status.fnArr;
      _results = [];
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        fn = _ref3[_j];
        _results.push(fn(mod));
      }
      return _results;
    })();
    if (status.color) {
      ansiColorStart = levelInfo.ansiColor;
      ansiColorEnd = color.ANSI_END;
      return ret[level] = function() {
        var args, fn, fnOutput, outputs, str, _j, _len2;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        outputs = [];
        for (_j = 0, _len2 = levelFns.length; _j < _len2; _j++) {
          fn = levelFns[_j];
          fnOutput = fn(level, args, levelInfo.title, moduleTitle);
          if (fnOutput != null) {
            outputs.push(fnOutput);
          }
        }
        str = ansiColorStart + outputs.join(separatorItem) + ansiColorEnd;
        logFn.call(loggerContext, str);
      };
    } else {
      return ret[level] = function() {
        var args, fn, fnOutput, joinedOutput, outputs, _j, _len2;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        outputs = [];
        for (_j = 0, _len2 = levelFns.length; _j < _len2; _j++) {
          fn = levelFns[_j];
          fnOutput = fn(level, args, levelInfo.title, moduleTitle);
          if (fnOutput != null) {
            outputs.push(fnOutput);
          }
        }
        joinedOutput = outputs.join(separatorItem);
        logFn.call(loggerContext, joinedOutput);
      };
    }
  };
  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
    levelInfo = _ref2[_i];
    _fn(levelInfo);
  }
  return ret;
};