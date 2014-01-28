var _ = require('lodash');
var q = require('q');
var request = require('request');

var KV = require('../kv');

function CrawlerFactory() {
  return this;
}
CrawlerFactory.prototype.name = "CrawlerFactory";


CrawlerFactory.prototype.parseList = function (last_item_key, crawler, Model, that) {
  KV
    .get(last_item_key)
    .then(function (last_item) {
      return crawler.parseList(last_item);
    })
    .then(function (item_list) {
      return Model.bulkCreate(item_list);
    })
    .then(function (item_list) {
      var last_item = item_list[0].url;
      return KV.set(last_item_key, last_item, item_list.length);
    })
    .then(function (item_list_length) {
      that.emit('success', item_list_length + ' new items');
    })
    .fail(function (error) {
      if (typeof error === 'string') {
        if (error === 'timeout') {
          that.emit('timeout');
        } else if (error === 'nothing') {
          that.emit('delay', error);
        } else {
          // 404? wtf? die!
          console.log(error);
          throw('WTF');
        }
      } else {
        that.emit('error', error);
      }
    })
    .done();
};


module.exports = CrawlerFactory;
