var q = require('q'),
    moment = require('moment');

var KV = require('../models').KV;


module.exports = {
  get: function (key) {
    var d = q.defer();

    var query = {
      where: {
        key: key,
      }
    };

    KV.find(query)
      .success(function (kv) {
        if (kv) {
          d.resolve(kv.value);
        } else {
          d.reject('not found');
        }
      });

    return d.promise;
  },

  set: function (key, value, callback) {
    var d = q.defer();

    var query = {
      where: {
        key: key,
      }
    };

    KV.find(query)
      .success(function (kv) {
        if (kv) {
          kv.value = value;
          kv.save()
            .success(function () {
              d.resolve();
            })
            .error(function (error) {
              d.reject('kv.save');
            });
        } else {
          d.reject('not found');
        }
      });

    return d.promise;
  },

  isExpired: function (key, interval) { // interval in seconds
    var d = q.defer();

    this.get(key)
        .then(function (value) {
          var v = moment(value).add('seconds', interval);
          var now = moment();
          d.resolve(v <= now);
        })
        .fail(function (errorText) {
          d.reject(errorText);
        })
        .done();

    return d.promise;
  }
};
