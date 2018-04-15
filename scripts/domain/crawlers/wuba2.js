var Wuba = require('./wuba');

var Wuba2 = function () {
  return this;
};

Wuba2.prototype = new Wuba();

Wuba2.prototype._url = "http://sh.58.com/jzsoftware/";

module.exports = Wuba2;
