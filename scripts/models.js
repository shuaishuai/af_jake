var nconf = require('nconf'),
    util = require('util');

var mysql_config = "";
if (nconf.get('is_local')) {
  var db = nconf.get('database');
  mysql_config = util.format('mysql://%s:%s@%s/%s', db.username, db.password, db.hostname, db.name);
} else {
  var services = JSON.parse(nconf.get('VCAP_SERVICES'));
  var c = services['mysql-5.1'][0].credentials;
  mysql_config = util.format('mysql://%s:%s@%s/%s', c.username, c.password, c.hostname, c.name);
}
// var mysql_config = 'mysql://root:654321@localhost/af_asimov';
// console.log(mysql_config);

var _ = require('lodash'),
    q = require('q'),
    moment = require('moment');

var Sequelize = require("sequelize"),
    sequelize = new Sequelize(mysql_config, { logging: false });

// ** always order by `id`, `created` is not reliable
var Report = sequelize.define('Report', {
  id: Sequelize.INTEGER,
  created: Sequelize.DATE,
  code: Sequelize.INTEGER,
  name: Sequelize.STRING(31),
  url: Sequelize.STRING(255),
  title: Sequelize.STRING(255),
  content: { type: Sequelize.TEXT, defaultValue: 'EMPTY' },
  flag: { type: Sequelize.INTEGER, defaultValue: 1 }, // 1: unread, 2: read, 3: star
}, { timestamps: false, tableName: 'report' });

var Parttime = sequelize.define('Parttime', {
  id: Sequelize.INTEGER,
  created: Sequelize.DATE,
  url: Sequelize.STRING(255),
  title: { type: Sequelize.STRING(255), defaultValue: 'EMPTY' },
  content: { type: Sequelize.TEXT, defaultValue: 'EMPTY' },
}, { timestamps: false, tableName: 'parttime' });


var KV = sequelize.define('KV', {
  id: Sequelize.INTEGER,
  updated: Sequelize.DATE,
  key: Sequelize.STRING(63), // FIXME: 'key' is a MySQL reserved keyword
  value: Sequelize.STRING(255),
}, { timestamps: false, tableName: 'kv' });


var StockCode = sequelize.define('StockCode', {
  id: Sequelize.INTEGER, // FIXME: primary key
  code: Sequelize.INTEGER, // FIXME: unique key
  name: Sequelize.STRING(31),
  market: Sequelize.STRING(7),
  is_active: Sequelize.INTEGER,  // NOT delist, AND NOT broken
  is_delist: Sequelize.INTEGER,
  is_st: Sequelize.INTEGER,
  is_new: Sequelize.INTEGER,
  is_broken: Sequelize.INTEGER,
  is_hs300: Sequelize.INTEGER,
  is_jqka: Sequelize.INTEGER,
}, { timestamps: false, tableName: 'stock_code' });


var Price = sequelize.define('Price', {
  id: Sequelize.INTEGER, // FIXME: primary key
  fetched: Sequelize.DATE,
  sell: Sequelize.DECIMAL(10, 2),
  buy: Sequelize.DECIMAL(10, 2),
  medial: Sequelize.DECIMAL(10, 2),
  lower: Sequelize.DECIMAL(10, 2),
  upper: Sequelize.DECIMAL(10, 2),
}, { timestamps: false, tableName: 'price',
     // FIXME: not elegant
     classMethods: {
       repr_fields: function () {
         return [ 'fetched', 'sell', 'buy', 'medial', 'lower', 'upper' ];
       }
     },
     instanceMethods: {
       repr: function () {
         return {
           'fetched': moment(this.fetched).format(),
           'sell': this.sell,
           'buy': this.buy,
           'medial': this.medial,
           'lower': this.lower,
           'upper': this.upper,
         };
       }
     }
});

var CronTab = sequelize.define('CronTab', {
  id: Sequelize.INTEGER,
  created: Sequelize.DATE,
  active: Sequelize.INTEGER,
  uuid: Sequelize.STRING(63),
  name: Sequelize.STRING(63),
  interval: Sequelize.INTEGER,
  last_attempt: Sequelize.BIGINT, // Date.now(), utc timestamp
}, { timestamps: false, tableName: 'cron_tab',
  classMethods: {
    getJob: function () {
      var d = q.defer();

      var query = {
        where: {
          active: 1,
        },
        order: 'last_attempt',
      };

      this.findAll(query)
        .success(function (ct) {
          var now = Date.now();

          var job = _.find(ct, function (c) {
            var expired = c.last_attempt + c.interval;
            return expired <= now;
          });

          // var winston = require('./logger');
          // winston.info(now);
          // winston.info(ct[0].last_attempt + ' ' + ct[0].name);
          // winston.info(ct[1].last_attempt + ' ' + ct[1].name);
          // winston.info(ct[2].last_attempt + ' ' + ct[2].name);
          // winston.info(ct[3].last_attempt + ' ' + ct[3].name);
          // winston.info(job.last_attempt + ' ' + job.name);

          if (job) {
            d.resolve(job);
          } else {
            d.reject('no expired job');
          }
        });

      return d.promise;
    }
  },
});

module.exports = {
  Report: Report,
  Parttime: Parttime,
  KV: KV,
  StockCode: StockCode,
  Price: Price,
  CronTab: CronTab,
};
