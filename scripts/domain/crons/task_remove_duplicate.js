var q = require('q');

var models = require('../../models');
var raw_conn = models.raw_conn;

function RemoveDuplicate() { }
var Task = require('./task');
RemoveDuplicate.prototype = new Task();

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


RemoveDuplicate.prototype.do = function () {
  var that = this;

  raw_conn.query(sql_parttime, function (error, result) {
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
  raw_conn.end();
};


module.exports = new RemoveDuplicate();
