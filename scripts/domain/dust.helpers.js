function _code_formater(chunk, context, bodies, params) {
  var code = "000000" + params.code;
  chunk.write(code.substring(code.length - 6));
  return chunk;
}

function init (helpers) {
  helpers['code_formater'] = _code_formater;
}

module.exports = {
  init: init
};
