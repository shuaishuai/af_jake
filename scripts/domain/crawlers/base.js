var _ = require('lodash'),
    q = require('q'),
    request = require('request');

var winston = require('../../logger');

function Crawler(argument) {
  return this;
}

Crawler.prototype.name = "Crawler";


function _get(url, options) {
  var d = q.defer();

  request.get(url, options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      d.resolve(body);
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      d.resolve('timeout');
    } else {
      console.log(error, response, body);
      d.reject(error);
    }
  });

  return d.promise;
}

function _get_openshift(url, options) {
  var d = q.defer();

  var u = 'http://jake-hbrls.rhcloud.com/crawler?url=' + encodeURIComponent(url);

  request.get(u, options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      d.resolve(body);
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      d.resolve('timeout');
    } else {
      console.log(error, response, body);
      // FIXME: need better error controlling
      d.reject('Jake on OpenShift failed');
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
}


Crawler.prototype.get = function (url, options) {
  // url = "http://www.facebook.com";

  var d = q.defer();

  var _default_options = {
    timeout: 60000,
    encoding: null
  };
  if (options) {
    _.extend(_default_options, options);
  }

  _get(url, _default_options)
    .then(function (body) {
      if (body === 'timeout') {
        return _get_openshift(url, _default_options);
      } else {
        d.resolve(body);
      }
    })
    .then(function (body) {
      if (body === 'timeout') {
        d.reject('timeout connecting to ' + url);
      } else {
        d.resolve(body);
      }
    })
    .fail(function (EorW) {
      d.reject(EorW);
    })
    .done();

  return d.promise;
};

// Crawler.prototype.error_2_str = function (error) {
//   winston.error(error.stack);
//   var errorText = error.name + ': ' + error.message;
//   return errorText;
// };


module.exports = Crawler;
