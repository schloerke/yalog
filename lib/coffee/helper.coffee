


_    = require 'underscore'
util = require 'util'



is_express_req_obj = (obj) ->
  obj or= {}
  return _.has(obj, "route") and _.has(obj, "res") and _.has(obj, "next")


item_by_keys = (obj, keyArr) ->
  item = obj
  for key in keyArr
    return null unless _.has(item, key)
    item = item[key]

  return item.toString()


req_item_by_keys = (keyArr) ->
  return (mod) ->
    return (level, args) ->
      reqObj = args[0] or {}
      return null unless is_express_req_obj(reqObj)

      return item_by_keys(reqObj, keyArr)


exports.iso_date = (opts = {}) ->
  return (mod) ->
    return (level, args) ->
      return (new Date()).toISOString()


exports.level = (opts = {}) ->
  return (mod) ->
    return (level, args, realTitle) ->
      return realTitle


exports.session_user_id = ({init, defArr} = {}) ->
  defArr ?= ["session", "user", "id"]
  init   ?= null
  return req_item_by_keys(defArr)


exports.session_user_email = ({init, defArr} = {}) ->
  defArr ?= ["session", "user", "email"]
  init   ?= null
  return req_item_by_keys(defArr) or init


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


inspectToSingleLineRegex = /(?:^|\n) */g
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
      # remove all '\n' but not '\\n' as that is an escaped '\n' and not something introduced by util.inspect
      ret = ret.replace(inspectToSingleLineRegex, '') or init
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



do_but_ignore_req_at_first = (fn) ->

  return (opts = {}) ->
    fn_after_opts = fn(opts)
    return (mod) ->
      fn_after_mod = fn_after_opts(mod)
      return (level, args) ->
        args or= []
        if is_express_req_obj(args[0] or null)
          return fn_after_mod(level, args.slice(1))
        else
          return fn_after_mod(level, args)


exports.single_line_message_ignore_express_req_at_first = do_but_ignore_req_at_first(exports.single_line_message)
exports.message_ignore_express_req_at_first             = do_but_ignore_req_at_first(exports.message)


exports.string = (x) ->
  return _.once (mod) ->
    return _.once (level, args) ->
      return x













