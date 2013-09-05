// http://sequelizejs.com/documentation
var mysql_config = require('./env').mysql_config;

var Sequelize = require("sequelize");
var sequelize = new Sequelize(mysql_config, { logging: false });

module.exports = {
  sequelize: sequelize
};
