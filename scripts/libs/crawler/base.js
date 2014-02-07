var _ = require('lodash');
var q = require('q');
var request = require('request');

function Crawler(argument) { }
Crawler.prototype.name = "Crawler";


var me = require('./workers/me');
var balance = [ me, me, me, me, me, me, me, me ];
    //          0   1   2   3   4   5   6   7

Crawler.prototype.get = function (url, options) {
  var _default_options = {
    timeout: 60000,
    encoding: null
  };
  if (options) {
    _.extend(_default_options, options);
  }

  var worker = balance[Math.floor(Math.random() * balance.length)];

  return worker.get(url, _default_options);
};

Crawler.filterNewItems = function (all_items, last_items, prop) {
  var d = q.defer();

  var items = [];
  var item;
  for (var i = 0; i < all_items.length; i++) {
    item = all_items[i];

    if (last_items.indexOf(item[prop]) > -1) {
      break;
    }

    items.push(item);
  }

  var new_last_items = _.map(all_items, function (item) {
    return item[prop];
  });

  if (items.length === 0) {
    d.reject('nothing');
  } else {
    d.resolve({
      items: items,
      last_items: new_last_items,
    });
  }

  return d.promise;
};


module.exports = Crawler;
