

_ = require 'underscore'

color = require './color'

log = _.identity


exports.defaultLogLevels = [
  { title: 'test' , color: 'magenta'}
  { title: 'trace', color: 'cyan'   }
  { title: 'debug', color: 'blue'   }
  { title: 'info' , color: 'green'  }
  { title: 'warn' , color: 'yellow' }
  { title: 'error', color: 'red'    , background: 'black', attr: ['bold', 'underline']}
]

exports.defaultFileLevels = [
  ["*", "trace"]
]



# @return array of items that contain {title: title.toUpperCase(), rawTitle, pos, ansiColor start}
parse_log_levels = (methods) ->
  unless _.isArray(methods)
    throw "methods is defined, but is not an array"

  titlesSeen = {}

  maxTitleSize = 0
  ret          = []

  for method, pos in methods
    unless method.title
      throw "title not found for the #{ pos } method"

    title        = method.title.toUpperCase()
    maxTitleSize = Math.max(maxTitleSize, title.length)

    if titlesSeen[title]
      throw "title already found for '#{ title }'.  Must be unique values when taken 'toUpperCase'"
    titlesSeen[title] = true

    ret.push {
      title    : title
      rawTitle : method.title
      pos      : pos
      ansiColor: color.ansi_str {
        font      : method.color
        background: method.background
        attr      : method.attr
      }
    }

  # pad the title to align nicely
  for item in ret
    while (item.title.length < maxTitleSize)
      item.title += ' '

  return ret


# @return map of title to ansiColors
log_levels_to_map_of_color = (logLevels) ->

  ret = {}
  for logLevel in logLevels
    ret[logLevel.title] = logLevel.ansiColor
  return ret


# @return array of rawTitles of each logLevel
log_levels_to_raw_title_arr = (logLevels) ->
  return _.pluck(logLevels, "rawTitle")

# @return map of file to map of levels: true
# @returnEx
#   input = {
#     ["*", "test"]
#     ["myFile", ["debug", "warn"]]
#   }
#   {
#     '*': {
#       TEST : true
#       TRACE: true
#       DEBUG: true
#       INFO : true
#       WARN : true
#       ERROR: true
#     }
#     myFile: {
#       DEBUG: true
#       WARN : true
#     }
#   }
parse_file_levels = (fileLevels, logLevels) ->
  # log levels is passed as properly parsed log levels. no need to check

  unless _.isArray(fileLevels)
    throw "fileLevels is defined, but is not an array"

  logLevelNameArr = log_levels_to_raw_title_arr(logLevels)


  ret = {}
  for row, pos in fileLevels
    unless _.isArray(row) and row.length is 2
      throw "level in row #{ pos } is defined, but is not an array of length 2"
    rowFile   = row[0]
    rowLevels = row[1]

    # upgrade a string level to a
    if _.isString(rowLevels)
      # "info" turns into ["info", "warn", "error"]
      logPos = logLevelNameArr.indexOf(rowLevels)
      unless logPos isnt -1
        throw "level in row '#{ pos }' is not a defined log level"

      rowLevels = logLevelNameArr.slice(logPos)
    else
      unless _.isArray(rowLevels)
        throw "level in row '#{ pos }' is not a string or an array"

      # is array. check for all strings
      unless _.uniq(rowLevels).length is rowLevels.length
        throw "log levels in row '#{ pos }' are not unique"

      for rowLevel in rowLevels
        unless _.include(logLevelNameArr, rowLevel)
          throw "log level called '#{ rowLevel }' in row '#{ pos }' is not a valid log level"

      # rowLevels are now valid

    rowMap = {}
    for rowLevel in rowLevels
      rowMap[rowLevel] = true

    ret[rowFile] = rowMap

  return ret


exports.parse = ({logLevels, fileLevels}) ->
  logLevels  ?= exports.defaultLogLevels
  fileLevels ?= exports.defaultFileLevels

  parsedLogLevels = parse_log_levels(logLevels)

  parsedFileLevels = parse_file_levels(fileLevels, parsedLogLevels)

  return {
    logLevels
    fileLevels
    parsedLogLevels
    colorMap    : log_levels_to_map_of_color(parsedLogLevels)
    fileLevelMap: parsedFileLevels
  }











