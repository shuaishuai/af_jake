var http = require('http');

function createServer(app) {
  return http.createServer(app);
}

module.exports = {
  createServer: createServer
};