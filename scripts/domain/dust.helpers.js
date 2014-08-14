function init (helpers) {
  helpers.code_formater = function (chunk, context, bodies, params) {
    var code = "000000" + params.code;
    chunk.write(code.substring(code.length - 6));
    return chunk;
  };
}

module.exports = {
  init: init
};
