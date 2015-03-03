"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var klm = _interopRequire(require("koa-load-middlewares"));

var STARTREK = "Star Trek";

var defaultStack = exports.defaultStack = function (app) {
  var config = app.config;
  var ms = klm();

  if (app.env !== "production") {
    app.use(ms.logger());
  }

  ms.qs(app);
  app.use(ms.favicon(path.join(config.publicPath, "favicon.icon")));
  app.use(ms.responseTime());
  app.use(ms.methodoverride());
  app.use(ms.xRequestId(undefined, true, true));

  var morgan = ms.morgan;
  var logStream = fs.createWriteStream(config.paths.get("log").first, { flags: "a" });
  app.use(morgan.middleware("combined", { stream: logStream }));

  // add remoteIp

  var secretKeyBase = config.secrets.secretKeyBase;
  app.keys = Array.isArray(secretKeyBase) ? secretKeyBase : [secretKeyBase || STARTREK];
  app.use(ms.genericSession(config.secrets.session));

  app.use(ms.lusca(config.secrets));
  app.use(ms.bodyparser());
  app.use(ms.router(app));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});