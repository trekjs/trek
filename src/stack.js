import fs from 'fs';
import path from 'path';
import klm from 'koa-load-middlewares';

const STARTREK = 'Star Trek';

export var defaultStack = (app) => {
  let [config, ms] = [app.config, klm()];
  let isProduction = app.env === 'production';

  if (!isProduction) {
    app.use(ms.logger());
  }

  ms.qs(app);
  app.use(ms.favicon(path.join(config.publicPath, 'favicon.icon')));
  app.use(ms.responseTime());
  app.use(ms.methodoverride());
  app.use(ms.xRequestId(undefined, true, true));

  let morgan = ms.morgan;
  let logStream = fs.createWriteStream(config.paths.get('log').first, { flags: 'a' });
  app.use(morgan.middleware(isProduction ? 'combined' : 'dev', { stream: logStream }));

  // add remoteIp

  let secretKeyBase = config.secrets.secretKeyBase;
  app.keys = Array.isArray(secretKeyBase) ? secretKeyBase : [secretKeyBase || STARTREK];
  app.use(ms.genericSession(config.secrets.session));

  app.use(ms.lusca(config.secrets));
  app.use(ms.bodyparser());
  app.use(ms.router(app));
};