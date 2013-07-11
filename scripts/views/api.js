var cheerio = require('cheerio');
var request = require('request');
var async = require('async');

var endpoint_yicai = "http://www.yicai.com/";
function yicai_heima(req, res) {
  async.waterfall([
    function (callback) {
      var endpoint = "bo/heimajingxuan/list/";
      request.get(endpoint_yicai + endpoint, function (e, r, body) {
        if (!e && r.statusCode == 200) {
          var $ = cheerio.load(body);
          var endpoint_item = $(".views-field-title a").first().attr('href');

          callback(null, endpoint_item);
        } else {
          res.send("failed");
        }
      });
    },
    function (endpoint, callback) {
      request.get(endpoint_yicai + endpoint, function (e, r, body) {
        if (!e && r.statusCode == 200) {
          var $ = cheerio.load(body);
          var id = $('.video-cion').attr('id');

          console.log(id);

          var downloadUrl = [
            "http://v.yicai.com/kalturaCE/content/entry/data/0/53/",
            id.substring(0, id.length - 2),
            "_100000.flv"
          ].join("");

          console.log(downloadUrl);

          res.send("success");
        } else {
          res.send("failed");
        }
      });
    }],
    function (err, result) {
      console.log(err);
      res.send("failed");
  });
}

module.exports = {
  yicai_heima: yicai_heima
};
