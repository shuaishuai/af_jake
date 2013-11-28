var winston = require('../logger');

// text/html
function _text(type) {
  var logger = {
    'success': winston.info,
    'warning': winston.warn,
    'error': winston.error,
  }[type];

  return function (res, message, logentries) {
    if (!message) {
      message = "";
    }

    if (logentries) {
      logger(logentries);
    }

    res.send(type + ": " + message);
  };
}

var _textSuccess = new _text('success');
var _textWarning = new _text('warning');
var _textError = new _text('error');

// application/json

// application/xml

module.exports = {
  textSuccess: _textSuccess,
  textWarning: _textWarning,
  textError: _textError,
};