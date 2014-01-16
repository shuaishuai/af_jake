var _ = require('lodash'),
    q = require('q'),
    request = require('request');

function _isTimeoutError(error) {
  return error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT';
}

//
function Me() { return this; }

Me.prototype.get = function (url, options) {
  var d = q.defer();

  request.get(url, options, function (error, response, body) {
    if (!error) {
      d.resolve(body);
    } else if (_isTimeoutError(error)) {
      d.reject('Me timeout: ' + url);
    } else {
      console.log(error, response, body);
      d.reject(error);
    }
  });

  return d.promise;
};

//
function OpenShift() { return this; }

OpenShift.prototype.get = function (url, options) {
  var d = q.defer();

  var u = 'http://jake-hbrls.rhcloud.com/crawler?url=' + encodeURIComponent(url);
  // var u = 'http://127.0.0.1:3001/crawler?url=' + encodeURIComponent(url);

  request.get(u, options, function (error, response, body) {
    if (!error) {
      if (body === 'timeout') {
        d.reject('OpenShift timeout: ' + url);
      } else {
        d.resolve(body);
      }
    } else if (_isTimeoutError(error)) {
      d.reject('timeout connecting to OpenShift');
    } else if (error.code === 'ECONNRESET') {
      d.reject('OpenShift GFW: ' + url);
    } else {
      console.log(error, response, body);
      // FIXME: need better error controlling
      d.reject('OpenShift ' + error.toString() + ': ' + url);
      // if (response.statusCode === 500) {
      //   if (body === 'timeout') {
      //     d.resolve('timeout');
      //   } else {
      //     d.reject(body);
      //   }
      // } else {
      //   console.log(error, response, body);
      //   d.reject(error);
      // }
    }
  });

  return d.promise;
};

var jMe = new Me(),
    jOS = new OpenShift(),
    balance = [ jMe, jMe, jMe, jMe, jMe, jMe, jMe, jMe ];
    //          0    1    2    3    4    5    6    7


module.exports = {
  get: function (url, options) {
    var n = Math.floor(Math.random() * balance.length);
    return balance[n].get(url, options);
  }
};
