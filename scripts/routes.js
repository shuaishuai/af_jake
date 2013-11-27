var basic = require('./views/basic'),
    api = require('./views/api'),
    cron = require('./views/cron'),
    feed = require('./views/feed');


function never_cache(req, res, next) {
  var now = Date.now();
  res.set({
    'Cache-Control': 'max-age=0',
    'Expires': now,
    'Last-Modified': now,
  });

  next();
}

function init(app) {
  // basic
  app.get("/", basic.index);
  app.get("/hello", basic.hello);

  // api
  app.get("/api/yicai/heima", api.yicai_heima);

  // cron
  app.get("/cron/eastmoney/report/content", never_cache, cron.eastmoney_report_content);
  app.get("/cron/parttime/ganji", never_cache, cron.parttime_ganji);

  // atom
  app.get("/feed/reports", feed.reports);

  // error handling
  app.use(function(req, res, next){
    res.status(404).render("errors/404.dust");
  });

  app.use(function(err, req, res, next){
    res.status(500).render("errors/500.dust", { err: err.stack });
  });
}

exports.init = init;
