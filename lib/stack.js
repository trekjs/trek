"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.__esModule = true;

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

  app.use(ms.favicon(path.join(config.publicPath, "favicon.icon")));
  app.use(ms.responseTime());
  app.use(ms.methodoverride());
  app.use(ms.xRequestId(undefined, true, true));
  app.use(ms.staticCache(config.publicPath));

  let morganSettings = config.get("morgan");
  if (morganSettings) {
    let morgan = ms.morgan;
    app.use(morgan.middleware(config.get("morgan.mode"), config.get("morgan.stream") ? {
      stream: fs.createWriteStream(config.paths.get("log").first, {
        flags: "a"
      })
    } : null));
  }

  ms.locale(app);
  ms.qs(app);
  ms.swig(app, config.get("views"));

  let i18nSettings = config.get("i18n");
  if (i18nSettings) {
    app.use(ms.i18n(app, i18nSettings));
  }

  // add remoteIp

  let secretKeyBase = config.secrets.secretKeyBase;
  app.keys = Array.isArray(secretKeyBase) ? secretKeyBase : [secretKeyBase || STARTREK];
  app.use(ms.genericSession(config.secrets.session));

  let passport = ms.passport;
  app.use(passport.initialize());
  app.use(passport.session());
  Object.defineProperty(app, "passport", {
    get: function get() {
      return passport;
    },
    configurable: true
  });

  app.use(ms.flash({ key: "flash" }));

  let luscaSettings = config.get("lusca");
  if (luscaSettings) {
    app.use(ms.lusca(luscaSettings));
  }
  app.use(ms.bodyparser());
  app.use(ms.router(app));
};

exports.defaultStack = defaultStack;