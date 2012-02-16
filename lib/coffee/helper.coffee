


_    = require 'underscore'
util = require 'util'


exports.iso_date = (opts = {}) ->
  return (mod) ->
    return (level, args) ->
      return (new Date()).toISOString()


exports.level = (opts = {}) ->
  return (mod) ->
    return (level, args, realTitle) ->
      return realTitle


exports.line_number = (opts = {}) ->
  return (mod) ->
    return (level, args) ->
      try
        throw new Error()
      catch e
        # now magic will happen: get line number from callstack
        return e.stack.split('\n')[4].split(':')[1];


exports.module_title = (opts = {}) ->
  return (mod) ->
    return _.once (level, args, realTitle, moduleTitle) ->
      # if moduleTitle
      #   return moduleTitle

      unless mod
        return opts.init or '<unknown>'

      unless mod.id
        return mod

      if (mod.id is '.')
        return 'main'
      else
        return mod.id.replace(process.env.PWD, "").replace(/.js$/, "").replace(/^\//, "")


exports.file_and_line = (opts = {}) ->
  return (mod) ->
    line_fn = exports.line_number(opts)(mod)
    mod_title_fn = exports.module_title(opts)(mod)
    return (level, args) ->
      return mod_title_fn(level, args) + ":" + line_fn(level, args)


# no "start of line" because that is user generated, not inspect generated.
inspectToSingleLineRegex = /\n */g
exports.single_line_message = (opts = {}) ->
  showHidden = opts.showHidden
  depth      = opts.depth
  separator  = opts.separator ? ""
  init       = opts.init ? null
  return (mod) ->
    return (level, args) ->
      ret = []
      for item in (args or [])
        if _.isString(item)
          ret.push(item)
        else
          ret.push(util.inspect(item, showHidden, depth))

      ret = ret.join(separator)
      # remove all '\n' and spaces as they are something introduced by util.inspect
      ret = ret.replace(inspectToSingleLineRegex, ' ') or init
      return ret


exports.message = (opts = {}) ->
  showHidden = opts.showHidden
  depth      = opts.depth
  separator  = opts.separator ? ""
  init       = opts.init ? null
  return (mod) ->
    return (level, args) ->
      ret = []
      for item in (args or [])
        if _.isString(item)
          ret.push(item)
        else
          ret.push(util.inspect(item, showHidden, depth))

      # works because of "falsy" ''.
      ret = ret.join(separator) or init
      return ret


exports.string = (x) ->
  return _.once (mod) ->
    return _.once (level, args) ->
      return x


exports.process_title = exports.string(process.title)











