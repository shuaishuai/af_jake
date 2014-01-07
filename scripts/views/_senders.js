var winston = require('../logger');

// TODO: refacter this with next()

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
    } else {
      logger(message);
    }

    res.send([Date.now(), type, message].join(', '));
  };
}

var _textSuccess = new _text('success');
var _textWarning = new _text('warning');
var _textError = new _text('error');

function _textSender(req, res) {
  var message = res.locals.message;
  var logentries = res.locals.logentries;

  if (!logentries) {
    logentries = message.text + ', ' + req.get('user-agent');
  }

  if (message.type === 'error') {
    winston.error(logentries);
  } else if (message.type === 'warning') {
    winston.warn(logentries);
  } else if (message.type === 'success') {
    winston.info(logentries);
  } else {
    throw new Error('NotImplementedException');
  }

  res.send([Date.now(), message.type, message.text].join(', '));
}

// application/json

// application/xml

module.exports = {
  textSuccess: _textSuccess,
  textWarning: _textWarning,
  textError: _textError,
  textSender: _textSender,
};