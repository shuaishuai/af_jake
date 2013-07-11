var basic = require('./views/basic');
var api = require('./views/api');

function init(app) {
  // basic
  app.get("/", basic.index);
  app.get("/hello", basic.hello);

  // api
  app.get("/api/yicai/heima", api.yicai_heima);

  // error handling
  app.use(function(req, res, next){
    res.status(404).render("errors/404.ejs");
  });

  app.use(function(err, req, res, next){
    res.status(500).render("errors/500.ejs", { err: err.stack });
  });
}

exports.init = init;
