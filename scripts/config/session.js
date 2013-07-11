// MemorySession (built-in)
var express = require('express');
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

function getSessionStore() {
  return sessionStore;
}

module.exports = {
  getSessionStore: getSessionStore
};