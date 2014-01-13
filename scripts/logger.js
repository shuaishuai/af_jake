var nconf = require('nconf'),
    winston = require('winston');

var token = nconf.get('LOGENTRIES_TOKEN');
if (token !== '') {
  var logentries = require('node-logentries');
  var log = logentries.logger({ token: token });
  log.winston(winston);
}

module.exports = winston;