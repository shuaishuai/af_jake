var mysql = require('mysql');
var nconf = require('nconf');
var util = require('util');


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
  source: Sequelize.STRING(15),
  created: Sequelize.DATE,
  url: Sequelize.STRING(255),
  title: { type: Sequelize.STRING(255), defaultValue: 'EMPTY' },
  content: { type: Sequelize.TEXT, defaultValue: 'EMPTY' },
}, { timestamps: false, tableName: 'parttime' });


var KV = sequelize.define('KV', {
  id: Sequelize.INTEGER,
  updated: Sequelize.DATE,
  name: Sequelize.STRING(63),
  value: Sequelize.TEXT,
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
  jqka_score: Sequelize.DECIMAL(2, 1),
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
  delay: Sequelize.INTEGER,
  last_attempt: Sequelize.BIGINT, // Date.now(), utc timestamp
}, { timestamps: false, tableName: 'cron_tab' });

var Doctor = sequelize.define('Doctor', {
  id: Sequelize.INTEGER,
  updated: Sequelize.DATE,
  is_parsed: Sequelize.INTEGER,
  profile_url: Sequelize.STRING(255),
  contact_url: Sequelize.STRING(255),
  hospitals: Sequelize.STRING(255),
  firstname: { type: Sequelize.STRING(63), defaultValue: 'EMPTY' },
  lastname: Sequelize.STRING(63),
  credentials: Sequelize.STRING(15),
  address: Sequelize.STRING(255),
  address2: Sequelize.STRING(255),
  city: Sequelize.STRING(31),
  state: Sequelize.STRING(31),
  zip: Sequelize.STRING(15),
  phone: Sequelize.STRING(31),
  fax: Sequelize.STRING(31),
}, { timestamps: false, tableName: 'doctor' });


module.exports = {
  raw_conn: function () {
    return mysql.createConnection(mysql_config);
  },
  sequelize: sequelize,
  Report: Report,
  Parttime: Parttime,
  KV: KV,
  StockCode: StockCode,
  Price: Price,
  CronTab: CronTab,
  Doctor: Doctor,
};
