import fs from 'fs';
import path from 'path';
import klm from 'koa-load-middlewares';

const STARTREK = 'Star Trek';

const defaultStack = (app) => {
  let [ config, ms, isProduction ]
    = [ app.config, klm(), app.env === 'production' ];

  if (!isProduction) {
    app.use(ms.logger());
  }

  app.use(ms.favicon(path.join(config.publicPath, 'favicon.icon')));
  app.use(ms.responseTime());
  app.use(ms.methodoverride());
  app.use(ms.xRequestId(undefined, true, true));
  app.use(ms.staticCache(config.publicPath));

  let morgan = ms.morgan;
  app.use(morgan.middleware(
    config.get('morgan.mode'),
    config.get('morgan.stream')
      ? {
          stream: fs.createWriteStream(config.paths.get('log').first, { flags: 'a' })
        }
      : null
  ));

  ms.locale(app);
  ms.qs(app);
  ms.swig(app, config.get('views'));

  let i18nSettings = config.get('i18n');
  if (i18nSettings) {
    app.use(ms.i18n(app, i18nSettings));
  }

  // add remoteIp

  let secretKeyBase = config.secrets.secretKeyBase;
  app.keys = Array.isArray(secretKeyBase)
    ? secretKeyBase
    : [secretKeyBase || STARTREK];
  app.use(ms.genericSession(config.secrets.session));

  let passport = ms.passport;
  app.use(passport.initialize());
  app.use(passport.session());
  Object.defineProperty(app, 'passport', {
    get: function () {
      return passport;
    },
    configurable: true
  });

  app.use(ms.lusca(config.secrets));
  app.use(ms.bodyparser());
  app.use(ms.router(app));
};

export { defaultStack };