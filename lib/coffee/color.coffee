

# methods: [
#   {title: "test", color: "cyan", attr: ["bold", "blink", "inverse"]}
# ]



attrMap = {
  off      : 0
  bold     : 1
  italic   : 3
  underline: 4
  blink    : 5
  inverse  : 7
  hidden   : 8
}

fontMap = {
  black  : 30
  red    : 31
  green  : 32
  yellow : 33
  blue   : 34
  magenta: 35
  cyan   : 36
  white  : 37
}


backgroundMap = {
  black  : 40
  red    : 41
  green  : 42
  yellow : 43
  blue   : 44
  magenta: 45
  cyan   : 46
  white  : 47
}


exports.ansi_str = ({font, background, attr}) ->

  fontNum = fontMap[font] or font or null

  backgroundNum = backgroundMap[background] or background or null

  items = ['0']
  items.push(fontNum)      if fontNum
  items.push(backgroundNum) if backgroundNum

  for item in (attr or [])
    itemNum = attrMap[item] or item or null
    if itemNum?
      items.push(itemNum)

  return '\x1B[' + items.join(';') + 'm'


exports.ANSI_END = '\x1B[0m'

