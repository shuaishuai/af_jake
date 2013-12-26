var moment = require('moment');

// http://sequelizejs.com/documentation#models-data-types
var Sequelize = require("sequelize"),
    sequelize = require('./config/mysql').sequelize;


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
}, { timestamps: false, tableName: 'cron_tab' });

module.exports = {
  Report: Report,
  KV: KV,
  StockCode: StockCode,
  Price: Price,
  CronTab: CronTab,
};
