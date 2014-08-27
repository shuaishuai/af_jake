// error
// |__________________________________________
// |N                                         |Y
// response.statusCode                        timeout
// |___________________________               |___________________________
// |200           |404         |else          |Y                          |N
// resolve(body)  reject(404)  reject('WTF')  reject('timeout')  reject(error)

var REGEX_INVALID_URI = /^Invalid URI/i;


module.exports = {
  isTimeout: function (error) {
    return error.code === 'ETIMEDOUT' ||
           error.code === 'ESOCKETTIMEDOUT' ||
           error.code === 'ECONNRESET';
  },
  isInvalidURI: function (error) {
    return error.code === 'ENOTFOUND' ||
           REGEX_INVALID_URI.test(error.message);
  }
};
