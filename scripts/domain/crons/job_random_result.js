var q = require('q');


module.exports = function () {
  var d = q.defer();

  var rnd = Math.random();

  if (rnd < 0.33) {
    d.reject(new Error(rnd));  // Error
  } else if (rnd < 0.66) {
    d.reject(rnd);             // Warning
  } else {
    d.resolve(rnd);            // Success
  }

  return d.promise;
};