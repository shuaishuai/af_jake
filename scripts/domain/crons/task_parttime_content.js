var q = require('q');

var models = require('../../models');
var Parttime = models.Parttime;

var Wuba = require('../crawlers/wuba');
var wb = new Wuba();
var Ganji = require('../crawlers/ganji');
var gj = new Ganji();


function ParttimeContent() { }
var Task = require('./task');
ParttimeContent.prototype = new Task();


ParttimeContent.prototype.do = function () {
  var that = this;

  var query = {
    where: {
      content: 'EMPTY',
    }
  };

  Parttime
    .find(query)
    .success(function (pt) {
      if (pt) {
        var task = {
          'ganji': gj,
          'wuba': wb,
        }[pt.source];

        task
          .parseJobContent(pt.url)
          .then(function (data) {
            if (data.created) { pt.created = data.created; }
            if (data.title) { pt.title = data.title; }
            if (data.content) { pt.content = data.content; }

            pt.save().success(function () {
              that.emit('success', '::' + pt.id + ' updated');
            });
          })
          .fail(function (error) {
            that.emit('error', error);
          })
          .done();
      } else {
        that.emit('delay', 'no empty parttime');
      }
    });
};


module.exports = new ParttimeContent();
