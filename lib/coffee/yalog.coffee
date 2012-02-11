
sys = require('sys')
fs  = require('fs')

_ = require 'underscore'

config = require './config'
color  = require './color'
helper = require './helper'
exports.helper = helper

# initalize with empty inputs
exports._status = status = {
  logger       : sys.puts
  loggerContext: sys
  file         : null
  color        : process.env.TERM?.indexOf('color')  >= 0
  separator    : " "
  fnArr: [
    helper.iso_date()
    helper.session_user_email()
    helper.level()
    helper.file_and_line()
    helper.string("-")
    helper.message_ignore_express_req_at_first({separator: " "})
  ]
}

add_levels_to_status = ({logLevels, fileLevels} = {}) ->
  parsedDefaults    = config.parse({logLevels, fileLevels})

  status.logLevels       = parsedDefaults.logLevels
  status.parsedLogLevels = parsedDefaults.parsedLogLevels
  status.fileLevels      = parsedDefaults.fileLevels

  status.colorMap        = parsedDefaults.colorMap
  status.fileLevelMap    = parsedDefaults.fileLevelMap
  status.defaultLogLevel = _.first(status.logLevels).title # default to the lowest level
  return

# init with nothing
add_levels_to_status()

exports.options = (opts) ->
  if _.has(opts, "logger") or _.has(opts, "loggerContext")
    unless _.has(opts, "logger")
      throw "'logger' not supplied. Must be a function to match the 'loggerContext' (which may have a value of null)"
    unless _.has(opts, "loggerContext")
      throw "'loggerContext' not supplied. A logger context must be supplied to avoid errors.  Ex. yalog.opts({logger: console.log, loggerContext: console})"

    status.logger        = opts.logger
    status.loggerContext = opts.loggerContext

  if _.has(opts, "color")
    status.color = opts.color

  if _.has(opts, "separator")
    status.separator = opts.separator

  if _.has(opts, "file")
    status.file = opts.file

    fileDataString = fs.readFileSync(opts.file)
    fileData       = JSON.parse(fileDataString)

    status.logLevels  = fileData.logLevels
    status.fileLevels = fileData.fileLevels

  else
    if _.has(opts, "logLevels")
      status.logLevels = opts.logLevels
    if _.has(opts, "fileLevels")
      status.fileLevels = opts.fileLevels

  if _.has(opts, "fnArr")
    status.fnArr = opts.fnArr
    for item, fnPos in status.fnArr
      if _.isString(item)
        do (item) ->
          status.fnArr[fnPos] = _.once( () -> return _.once( () -> return item))

      else if _.isFunction(item)
        # keep calm carry on
        null
      else
        throw "function at position '#{ fnPos }' is not a string that matches a helper method name or a function defined by you"

  add_levels_to_status {
    logLevels : status.logLevels
    fileLevels: status.fileLevels
  }
  return exports











# returns a object that contains all log
exports.with = (mod) ->

  moduleTitle = helper.module_title({})(mod)() # get function then execute it. only has one answer
  # console.error("fileLevelMap", status.fileLevelMap)
  # console.error("moduleTitle", moduleTitle)

  moduleLevelMap = status.fileLevelMap[moduleTitle] or status.fileLevelMap['*']
  unless moduleLevelMap?
    throw "No levels found for module: '#{ moduleTitle }'.  Please add the default file level of '*' or one that matches the module name."

  has_level = (lvl) ->
    # makes 'falsy' -> false; 'truthy' -> true
    return not (not moduleLevelMap[lvl])

  logFn         = status.logger
  loggerContext = status.logger
  separatorItem = status.separator

  ret = {
    _inColor      : status.color
    _title        : moduleTitle
    _logLevels    : status.logLevels
    _moduleLevels : _.keys(moduleLevelMap)
    _has_level    : has_level
    _separator    : separatorItem
    _logFn        : logFn
    _loggerContext: loggerContext
  }

  for levelInfo in status.parsedLogLevels
    # go through the keys (level names)
    do (levelInfo) ->
      level = levelInfo.rawTitle

      # console.log("--Adding level: ", level, levelInfo)
      unless _.isFunction(logFn)
        # don't do squat unless there is a log function
        ret[level] = _.identity
        return

      unless moduleLevelMap[level]
        # level does not exist for this module... add method that doesn't crash the user
        ret[level] = _.identity
        return

      # setup all fns to be init'ed with the module
      levelFns = (fn(mod) for fn in status.fnArr)

      if status.color

        ansiColorStart = levelInfo.ansiColor
        ansiColorEnd   = color.ANSI_END

        # color
        ret[level] = (args...) ->
          outputs = []
          for fn in levelFns
            fnOutput = fn(level, args, levelInfo.title, moduleTitle)
            # remove all null or undefined values.  helpers should make them strings to avoid the reduction
            if fnOutput?
              outputs.push(fnOutput)

          str = (ansiColorStart + outputs.join(separatorItem) + ansiColorEnd)

          # console.error("-- str: " + str)
          logFn.call(loggerContext, str)
          return


      else
        # no color
        ret[level] = (args...) ->
          outputs = []
          for fn in levelFns
            fnOutput = fn(level, args, levelInfo.title, moduleTitle)
            # remove all null or undefined values.  helpers should make them strings to avoid the reduction
            if fnOutput?
              outputs.push(fnOutput)

          joinedOutput = outputs.join(separatorItem)

          logFn.call(loggerContext, joinedOutput)
          return

  return ret

