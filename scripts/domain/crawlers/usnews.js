var q = require('q');
var $ = require('cheerio');
var moment = require('moment');
var _ = require('lodash');

var Crawler = require('../../libs/crawler').Crawler;

var USNews = function () {
  return this;
};

USNews.prototype = new Crawler();

USNews.prototype.parseList = function (last_items) {
  var current_page = last_items + 1;
  var host = 'http://health.usnews.com';
  var url = host + "/doctors/obstetrician-gynecologists?sort=name&specialty=obstetrician-gynecologists&page=" + current_page;

  var d = q.defer();

  this
    .get(url, { encoding: 'utf-8'})
    .then(function (body) {
      var $html = $(body);
      var $list = $html.find('#search-results tbody tr');

      var all_items = [];
      var $li;
      var href, name, locations;
      var hospitals, $hospitals, $hos;
      var now = new Date();
      for (var i = 0; i < $list.length; i++) {
        $li = $list.eq(i).find('.details-doctorResults');
        href = $li.find('.details-doctorResults_profileLink').attr('href');
        name = $li.find('.details-doctorResults_name a').text().trim().split(', ');

        $hospitals = $li.find('.details-doctorResults_hospitals li a');
        hospitals = [];
        for (var j = 0; j < $hospitals.length; j++) {
          $hos = $hospitals.eq(j);
          hospitals.push($hos.text().trim());
        }

        locations = $li.find('.details-doctorResults_location').text().trim().split(', ');

        all_items.push({
          updated: now,
          hospitals: hospitals.join(','),
          firstname: name[0].trim(),
          lastname: name[1].trim(),
          credentials: $li.find('.details-doctorResults_credentials').text().trim(),
          profile_url: host + href,
          contact_url: host + href + '/contact',
          city: locations[0].trim(),
          state: locations[1].trim(),
        });
      }

      // console.log(all_items);

      d.resolve({
        items: all_items,
        last_items: current_page,
      });
    })
    .fail(function (error) {
      d.reject(error);
    })
    .done();

    return d.promise;
};

USNews.prototype.parseContent = function (url) {
  var d = q.defer();

  this.get(url)
      .then(function (body) {
        var html = body.toString();

        var $html = $(html);
        // var errText = $html.find(".errText");

        var $divs = $html.find('#mapNearby').next().find('.item');
        var $address = $divs.eq(0).find('p');
        var $contact = $divs.eq(1).find('p');

        var address = _.compact(_.map($address.text().trim().split('\n'), function (a) {
          return a.trim();
        }));

        var contact = _.compact(_.map($contact.text().trim().split('\n'), function (c) {
          return c.trim();
        }));

        var phone = ""
        if (contact[0]) {
          phone = contact[0].substring(7);
        }

        var fax = "";
        if (contact[1]) {
          fax = contact[1].substring(5);
        }

        var now = new Date();
        d.resolve({
          updated: now,
          address: address[0],
          zip: address.slice(-1)[0],
          phone: phone,
          fax: fax,
        });
      })
      .fail(function (error) {
        d.reject(error);
      })
      .done();

  return d.promise;
};

module.exports = USNews;
