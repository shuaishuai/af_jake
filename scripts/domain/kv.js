var q = require('q');

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
};
