var q = require('q');
var moment = require('moment');

var models = require('../../models');
var raw_conn = models.raw_conn;

var Task = require('./task');
var task = new Task();

var sql_remove_outdated = 'DELETE FROM report WHERE created <= ';


task.do = function () {
  var that = this;

  var ago = moment().add('days', -3).format('YYYY-M-D');
  var sql = sql_remove_outdated + "'" +  ago + "';";

  var conn = raw_conn();

  conn.query(sql, function (error, result) {
    if (error) {
      that.emit('error', error);
    } else {
      if (result.affectedRows > 0) {
        that.emit('success', result.affectedRows);
      } else {
        that.emit('delay', 'no outdated rows');
      }
    }
  });
  conn.end();
};


module.exports = task;
