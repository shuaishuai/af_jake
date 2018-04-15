var q = require('q');
var _ = require('lodash');

var models = require('../../models');
var Doctor = models.Doctor;

var Task = require('./task');
var task = new Task();


var Crawler = require('../crawlers/usnews');
var crawler = new Crawler();

task.do = function () {
  var that = this;

  var query = {
    where: {
      is_parsed: 0,
    }
  };

  Doctor
    .find(query)
    .success(function (dc) {
      if (dc) {
        crawler
          .parseContent(dc.contact_url)
          .then(function (data) {
            _.forIn(data, function (v, k) {
              dc[k] = v;
            });

            dc.is_parsed = 1;

            dc.save().success(function () {
              that.emit('success', '::' + dc.id + ' updated');
            });
          })
          .fail(function (error) {
            if (typeof error === 'string') {
              if (error === '404' || error === '500') {
                // it seems that they failed to discriminate 404 from 500
                dc.is_parsed = -1;
                dc.save().success(function () {
                  that.emit('error', error);
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
