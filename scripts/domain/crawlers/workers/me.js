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
      } else if (response.statusCode === 200) {
        d.resolve(body);
      } else {
        console.log(response.statusCode);
        d.reject('WTF');
      }
    } else {
      if (common.isTimeout(error)) {
        d.reject('timeout');
      } else {
        d.reject(error);
      }
    }
  });

  return d.promise;
}

var me = new Me();

module.exports = me;
