var winston = require('winston');

var token = require('./config/env').logentries_token;
if (token !== '') {
  var logentries = require('node-logentries');
  var log = logentries.logger({ token: token });
  log.winston(winston);
}

module.exports = winston;