var q = require('q');

var models = require('../../models');
var Parttime = models.Parttime;

var Ganji = require('../crawlers/ganji');
var gj = new Ganji();


module.exports = function () {
  var d = q.defer();

  var query = {
    where: {
      content: 'EMPTY',
    }
  };

  Parttime
    .find(query)
    .success(function (job) {
      if (job) {
        gj.parseJobContent(job.url)
          .then(function (data) {
            job.content = data.content;
            job.save().success(function () {
              d.resolve('job ' + job.id + ' updated');
            });
          })
          .fail(function (EorW) {
            d.reject(EorW);
          })
          .done();
      } else {
        d.reject('no empty job');
      }
    });

  return d.promise;
};
