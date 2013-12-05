var q = require('q'),
    $ = require('cheerio');

var Crawler = require('./base.js');

var Ganji = function () {
  return this;
};

Ganji.prototype = new Crawler();

Ganji.prototype.getJobList = function () {
  var d = q.defer();

  var host = "http://sh.ganji.com";
  var url = host + "/jzwangzhanjianshe/";

  this.get(url, { encoding: 'utf-8'} )
      .then(function (body) {
        var $html = $(body);
        var job_list = $html.find('.job-list').map(function () {
          var $dl = $(this);
          var $a = $dl.find('dt a');

          return {
            created: $dl.attr('pt'),
            url: host + $a.attr('href')
          };
        });

        d.resolve({ success: job_list });
      })
      .fail(function (error) {
        d.reject(error);
      })
      .done();

  return d.promise;
};


module.exports = Ganji;
