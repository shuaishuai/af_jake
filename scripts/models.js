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
  flag: { type: Sequelize.INTEGER, defaultValue: 0 },
}, { timestamps: false, tableName: 'report' });


var KV = sequelize.define('KV', {
  id: Sequelize.INTEGER,
  updated: Sequelize.DATE,
  key: Sequelize.STRING(63), // The column name 'key' is a MySQL reserved keyword
  value: Sequelize.STRING(255),
}, { timestamps: false, tableName: 'kv' });


module.exports = {
  Report: Report,
  KV: KV,
};
