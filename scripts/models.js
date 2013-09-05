var Sequelize = require("sequelize"),
    sequelize = require('./config/mysql').sequelize;

// http://sequelizejs.com/documentation#models-data-types
var Report = sequelize.define('Report', {
  id: Sequelize.INTEGER,
  created: Sequelize.DATE,
  code: Sequelize.INTEGER,
  name: Sequelize.STRING(31),
  url: Sequelize.STRING(255),
  title: Sequelize.STRING(255),
  content: Sequelize.TEXT,
  flag: Sequelize.INTEGER,
}, { timestamps: false, tableName: 'report' });

module.exports = {
  Report: Report
};
