function _never_cache(req, res, next) {
  var now = Date.now();
  res.set({
    'Cache-Control': 'max-age=0',
    'Expires': now,
    'Last-Modified': now,
  });

  next();
}

module.exports = {
  never_cache: _never_cache,
};