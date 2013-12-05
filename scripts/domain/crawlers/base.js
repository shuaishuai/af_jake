var _ = require('lodash'),
    q = require('q'),
    request = require('request');

function Crawler (argument) {
  return this;
}

Crawler.prototype.name = "Crawler";

Crawler.prototype.get = function(url, options) {
  var d = q.defer();

  var _default_options = {
    encoding: null
  };
  if (options) {
    _.extend(_default_options, options);
  }

  request.get(url, _default_options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      d.resolve(body);
    } else {
      // FIXME: console.log(error, response)
      d.reject(error);
    }
  });

  return d.promise;
};


module.exports = Crawler;
