// error
// |__________________________________________
// |N                                         |Y
// response.statusCode                        timeout
// |___________________________               |___________________________
// |200           |404         |else          |Y                          |N
// resolve(body)  reject(404)  reject('WTF')  reject('timeout')  reject(error)


module.exports = {
  isTimeout: function(error) {
    return error.code === 'ETIMEDOUT'
           || error.code === 'ESOCKETTIMEDOUT';
  }
};
