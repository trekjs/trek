"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var klm = _interopRequire(require("koa-load-middlewares"));

const STARTREK = "Star Trek";

const defaultStack = function (app) {
  let config = app.config;
  let ms = klm();
  let isProduction = app.env === "production";

  if (!isProduction) {
    app.use(ms.logger());
  }

  ms.qs(app);
  ms.swig(app, config.get("views"));
  app.use(ms.favicon(path.join(config.publicPath, "favicon.icon")));
  app.use(ms.responseTime());
  app.use(ms.methodoverride());
  app.use(ms.xRequestId(undefined, true, true));
  app.use(ms.staticCache(config.publicPath));

  let morgan = ms.morgan;
  let logStream = fs.createWriteStream(config.paths.get("log").first, { flags: "a" });
  app.use(morgan.middleware(isProduction ? "combined" : "dev", { stream: logStream }));

  // add remoteIp

  let secretKeyBase = config.secrets.secretKeyBase;
  app.keys = Array.isArray(secretKeyBase) ? secretKeyBase : [secretKeyBase || STARTREK];
  app.use(ms.genericSession(config.secrets.session));

  app.use(ms.lusca(config.secrets));
  app.use(ms.bodyparser());
  app.use(ms.router(app));
};

exports.defaultStack = defaultStack;
Object.defineProperty(exports, "__esModule", {
  value: true
});