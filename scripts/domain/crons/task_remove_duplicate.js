var q = require('q');

var models = require('../../models');
var sequelize = models.sequelize;
var raw_conn = models.raw_conn;

var Task = require('./task');
var task = new Task();

var sql_parttime = [
  "DELETE FROM parttime WHERE id NOT IN",
  "(",
    "SELECT id FROM",
      "(",
        "SELECT DISTINCT id, url FROM parttime",
        "GROUP BY url",
        "ORDER BY id",
      ")",
    "as noduplicate",
  ")"
].join(" ");


task.do = function () {
  var that = this;

  var conn = raw_conn();

  conn.query(sql_parttime, function (error, result) {
    if (error) {
      that.emit('error', error);
    } else {
      if (result.affectedRows > 0) {
        that.emit('success', result.affectedRows);
      } else {
        that.emit('delay', 'no duplicate rows');
      }
    }
  });
  conn.end();
};


module.exports = task;
