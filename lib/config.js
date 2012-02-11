var color, log, log_levels_to_map_of_color, log_levels_to_raw_title_arr, parse_file_levels, parse_log_levels, _;
_ = require('underscore');
color = require('./color');
log = _.identity;
exports.defaultLogLevels = [
  {
    title: 'test',
    color: 'magenta'
  }, {
    title: 'trace',
    color: 'cyan'
  }, {
    title: 'debug',
    color: 'blue'
  }, {
    title: 'info',
    color: 'green'
  }, {
    title: 'warn',
    color: 'yellow'
  }, {
    title: 'error',
    color: 'red',
    background: 'black',
    attr: ['bold', 'underline']
  }
];
exports.defaultFileLevels = [["*", "trace"]];
parse_log_levels = function(methods) {
  var item, maxTitleSize, method, pos, ret, title, titlesSeen, _i, _len, _len2;
  if (!_.isArray(methods)) {
    throw "methods is defined, but is not an array";
  }
  titlesSeen = {};
  maxTitleSize = 0;
  ret = [];
  for (pos = 0, _len = methods.length; pos < _len; pos++) {
    method = methods[pos];
    if (!method.title) {
      throw "title not found for the " + pos + " method";
    }
    title = method.title.toUpperCase();
    maxTitleSize = Math.max(maxTitleSize, title.length);
    if (titlesSeen[title]) {
      throw "title already found for '" + title + "'.  Must be unique values when taken 'toUpperCase'";
    }
    titlesSeen[title] = true;
    ret.push({
      title: title,
      rawTitle: method.title,
      pos: pos,
      ansiColor: color.ansi_str({
        font: method.color,
        background: method.background,
        attr: method.attr
      })
    });
  }
  for (_i = 0, _len2 = ret.length; _i < _len2; _i++) {
    item = ret[_i];
    while (item.title.length < maxTitleSize) {
      item.title += ' ';
    }
  }
  return ret;
};
log_levels_to_map_of_color = function(logLevels) {
  var logLevel, ret, _i, _len;
  ret = {};
  for (_i = 0, _len = logLevels.length; _i < _len; _i++) {
    logLevel = logLevels[_i];
    ret[logLevel.title] = logLevel.ansiColor;
  }
  return ret;
};
log_levels_to_raw_title_arr = function(logLevels) {
  return _.pluck(logLevels, "rawTitle");
};
parse_file_levels = function(fileLevels, logLevels) {
  var logLevelNameArr, logPos, pos, ret, row, rowFile, rowLevel, rowLevels, rowMap, _i, _j, _len, _len2, _len3;
  if (!_.isArray(fileLevels)) {
    throw "fileLevels is defined, but is not an array";
  }
  logLevelNameArr = log_levels_to_raw_title_arr(logLevels);
  ret = {};
  for (pos = 0, _len = fileLevels.length; pos < _len; pos++) {
    row = fileLevels[pos];
    if (!(_.isArray(row) && row.length === 2)) {
      throw "level in row " + pos + " is defined, but is not an array of length 2";
    }
    rowFile = row[0];
    rowLevels = row[1];
    if (_.isString(rowLevels)) {
      logPos = logLevelNameArr.indexOf(rowLevels);
      if (logPos === -1) {
        throw "level in row '" + pos + "' is not a defined log level";
      }
      rowLevels = logLevelNameArr.slice(logPos);
    } else {
      if (!_.isArray(rowLevels)) {
        throw "level in row '" + pos + "' is not a string or an array";
      }
      if (_.uniq(rowLevels).length !== rowLevels.length) {
        throw "log levels in row '" + pos + "' are not unique";
      }
      for (_i = 0, _len2 = rowLevels.length; _i < _len2; _i++) {
        rowLevel = rowLevels[_i];
        if (!_.include(logLevelNameArr, rowLevel)) {
          throw "log level called '" + rowLevel + "' in row '" + pos + "' is not a valid log level";
        }
      }
    }
    rowMap = {};
    for (_j = 0, _len3 = rowLevels.length; _j < _len3; _j++) {
      rowLevel = rowLevels[_j];
      rowMap[rowLevel] = true;
    }
    ret[rowFile] = rowMap;
  }
  return ret;
};
exports.parse = function(_arg) {
  var fileLevels, logLevels, parsedFileLevels, parsedLogLevels;
  logLevels = _arg.logLevels, fileLevels = _arg.fileLevels;
    if (logLevels != null) {
    logLevels;
  } else {
    logLevels = exports.defaultLogLevels;
  };
    if (fileLevels != null) {
    fileLevels;
  } else {
    fileLevels = exports.defaultFileLevels;
  };
  parsedLogLevels = parse_log_levels(logLevels);
  parsedFileLevels = parse_file_levels(fileLevels, parsedLogLevels);
  return {
    logLevels: logLevels,
    fileLevels: fileLevels,
    parsedLogLevels: parsedLogLevels,
    colorMap: log_levels_to_map_of_color(parsedLogLevels),
    fileLevelMap: parsedFileLevels
  };
};