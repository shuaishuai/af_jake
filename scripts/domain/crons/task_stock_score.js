var q = require('q');

var models = require('../../models');
var StockCode = models.StockCode;

var KV = require('../kv');

var JQKA = require('../crawlers/jqka');
var jq = new JQKA();

var Task = require('./task');
var task = new Task();

function _nextOrFirst(last_id) {
  var d = q.defer();

  var query = {
    where: {
      id: { gt: last_id },
      is_delist: 0,
    },
  };

  StockCode.find(query).success(function (next_code) {
    if (next_code) {
      d.resolve(next_code);
    } else {
      StockCode.find({ where: { id: 1 }}).success(function (first_code) {
        if (first_code) {
          d.resolve(first_code);
        } else {
          d.reject(new Error('invalid first code id'));
        }
      })
    }
  });

  return d.promise;
}

function _updateScore(next_code) {
  var d = q.defer();

  jq.doctor(next_code.code)
    .then(function (data) {
      next_code.jqka_score = data.score;
      next_code.save().success(function () {
        d.resolve(next_code);
      });
    })
    .fail(function (error) {
      d.reject(error);
    })
    .done();

  return d.promise;
}


task.do = function () {
  var that = this;

  var key = "3d256512-9330-11e3-a6f7-0800272bd08d-laststockscore";
  KV.get(key)
    .then(function (last_id) {
      return _nextOrFirst(last_id);
    })
    .then(function (next_code) {
      return _updateScore(next_code);
    })
    .then(function (last_code) {
      var msg = "the jqka score of " + last_code.code + ' is ' + last_code.jqka_score;
      return KV.set(key, last_code.id, msg);
    })
    .then(function (msg) {
      that.emit('success', msg);
    })
    .fail(function (error) {
      that.emit('error', error);
    })
    .done();
};


module.exports = task;
