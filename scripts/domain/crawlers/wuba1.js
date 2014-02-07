var Wuba = require('./wuba');

var Wuba1 = function () {
  return this;
};

Wuba1.prototype = new Wuba();

Wuba1.prototype._url = "http://sh.58.com/jisuanjiwl/";

module.exports = Wuba1;
