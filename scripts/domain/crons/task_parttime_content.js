var q = require('q');

var models = require('../../models');
var Parttime = models.Parttime;

var Task = require('./task');
var task = new Task();


task.do = function () {
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
        var Crawler = require('../crawlers/' + pt.source);
        var crawler = new Crawler();

        crawler
          .parseJobContent(pt.url)
          .then(function (data) {
            if (data.created) { pt.created = data.created; }
            if (data.title) { pt.title = data.title; }

            if (data.content) { pt.content = data.content; } else { throw('404'); }

            pt.save().success(function () {
              that.emit('success', '::' + pt.id + ' updated');
            });
          })
          .fail(function (error) {
            if (typeof error === 'string') {
              if (error === '404') {
                pt.destroy().success(function () {
                  that.emit('error', error + ', ' + pt.url);
                });
              } else {
                that.emit('error', error);
              }
            } else {
              that.emit('error', error);
            }
          })
          .done();
      } else {
        that.emit('delay', 'no empty parttime');
      }
    });
};


module.exports = task;
