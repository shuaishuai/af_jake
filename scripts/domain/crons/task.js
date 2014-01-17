var util = require("util");
var events = require("events");


function Task() {
  events.EventEmitter.call(this);
}
util.inherits(Task, events.EventEmitter);


Task.prototype.do = function () {
  throw('Interface');
}


module.exports = Task;
