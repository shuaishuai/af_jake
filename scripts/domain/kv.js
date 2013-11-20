var KV = require('../models').KV;

// TODO: fail handlers
module.exports = {
  get: function (key, callback) {
    var query = {
      where: {
        key: key,
      }
    };

    KV.find(query).success(function (kv) {
      if (callback) {
        callback(kv.value);
      }
    });
  },

  set: function (key, value, callback) {
    var query = {
      where: {
        key: key,
      }
    };

    KV.find(query).success(function (kv) {
      kv.value = value;
      kv.save().success(function () {
        if (callback) {
          callback();
        }
      });
    });
  },
};
