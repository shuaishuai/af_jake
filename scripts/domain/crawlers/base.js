var _ = require('lodash'),
    q = require('q'),
    request = require('request');

var winston = require('../../logger');

function Crawler (argument) {
  return this;
}

Crawler.prototype.name = "Crawler";

Crawler.prototype.get = function(url, options) {
  var d = q.defer();

  var _default_options = {
    timeout: 30000,
    encoding: null
  };
  if (options) {
    _.extend(_default_options, options);
  }

  request.get(url, _default_options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      d.resolve(body);
    } else if (error.code === 'ETIMEDOUT') {
      d.reject('timeout connecting to ' + url);
    } else {
      console.log(error, response, body);
      d.reject(error);
    }
  });

  return d.promise;
};

// Crawler.prototype.error_2_str = function (error) {
//   winston.error(error.stack);
//   var errorText = error.name + ': ' + error.message;
//   return errorText;
// };


module.exports = Crawler;
