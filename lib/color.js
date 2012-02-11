var attrMap, backgroundMap, fontMap;
attrMap = {
  off: 0,
  bold: 1,
  italic: 3,
  underline: 4,
  blink: 5,
  inverse: 7,
  hidden: 8
};
fontMap = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37
};
backgroundMap = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47
};
exports.ansi_str = function(_arg) {
  var attr, background, backgroundNum, font, fontNum, item, itemNum, items, _i, _len, _ref;
  font = _arg.font, background = _arg.background, attr = _arg.attr;
  fontNum = fontMap[font] || font || null;
  backgroundNum = backgroundMap[background] || background || null;
  items = ['0'];
  if (fontNum) {
    items.push(fontNum);
  }
  if (backgroundNum) {
    items.push(backgroundNum);
  }
  _ref = attr || [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    item = _ref[_i];
    itemNum = attrMap[item] || item || null;
    if (itemNum != null) {
      items.push(itemNum);
    }
  }
  return '\x1B[' + items.join(';') + 'm';
};
exports.ANSI_END = '\x1B[0m';