var _ = require('lodash');
var q = require('q');
var request = require('request');

var KV = require('../../domain/kv');

function CrawlerFactory() {
  return this;
}
CrawlerFactory.prototype.name = "CrawlerFactory";


CrawlerFactory.prototype.parseList = function (last_items_key, crawler, Model, task) {
  KV
    .get(last_items_key)
    .then(function (last_items) {
      return crawler.parseList(last_items);
    })
    .then(function (result) {
      var items = result.items;
      var last_items = result.last_items;

      return KV.set(last_items_key, last_items, items);
    })
    .then(function (items) {
      return crawler.filters(items);
    })
    .then(function (items) {
      return Model.bulkCreate(items);
    })
    .then(function (items) {
      task.emit('success', items.length + ' new items');
    })
    .fail(function (error) {
      if (typeof error === 'string') {
        if (error === 'timeout') {
          task.emit('timeout');
        } else if (error === 'nothing') {
          task.emit('delay', error);
        } else {
          // 404? wtf? die!
          console.log(error);
          throw('WTF');
        }
      } else {
        task.emit('error', error);
      }
    })
    .done();
};


module.exports = CrawlerFactory;
