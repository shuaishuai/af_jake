var q = require('q');
var request = require('request');
var common = require('./common');

var Me = function () {};

Me.prototype.get = function (url, options) {
  var d = q.defer();

  request.get(url, options, function (error, response, body) {
    if (!error) {
      if (response.statusCode === 404) {
        d.reject('404');
      } else if (response.statusCode === 503) {
        d.reject('timeout'); // FIXME: server is overload or server hates you
      } else if (response.statusCode === 200) {
        d.resolve(body);
      } else {
        d.reject(response.statusCode + ', ' + url);
      }
    } else {
      if (common.isTimeout(error)) {
        d.reject('timeout');
      } else {
        console.log(error.code);
        d.reject(error);
      }
    }
  });

  return d.promise;
};

var me = new Me();

module.exports = me;
