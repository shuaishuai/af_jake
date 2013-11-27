var winston = require('../logger');

function _textSuccess(res, message, logentries) {
  if (!message) { message = ""; }

  if (logentries) {
    winston.info(logentries);
  }

  res.send("success: " + message);
}

function _textWarning(res, message, logentries) {
  if (!message) { message = ""; }

  if (logentries) {
    winston.warn(logentries);
  }

  res.send("warning: " + message);
}

function _textError(res, message, logentries) {
  if (!message) { message = ""; }

  if (logentries) {
    winston.error(logentries);
  }

  res.send("error: " + message);
}


module.exports = {
  textSuccess: _textSuccess,
  textWarning: _textWarning,
  textError: _textError,
};