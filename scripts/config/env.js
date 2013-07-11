var os = require('os');

var IS_LOCAL = ['VirtualU'].indexOf(os.hostname()) > -1;

var _port = IS_LOCAL ? 1337 : process.env.VCAP_APP_PORT

module.exports = {
  port: _port
};
