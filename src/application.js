import koaLoadMiddlewares from 'koa-load-middlewares';
import {MiddlewareStack} from './stack';
import {Engine, Configuration as EngineConfiguration} from './engine';


class DefaultMiddlewareStack {

  constructor(app, config, paths) {
    this._app = app;
    this._config = config;
    this._paths = paths;
  }

  get app() {
    return this._app;
  }
  get config() {
    return this._config;
  }
  get paths() {
    return this._paths;
  }

  buildStack() {
    return new MiddlewareStack((middleware) => {
      let ms = koaLoadMiddlewares();
      middleware.use(ms.responseTime());
      middleware.use(ms.methodoverride());
      middleware.use(ms.xRequestId(null, true));

      // add logger
      // add remoteIp
      // add cookies
      // add session

      middleware.use(ms.bodyparser());
    });
  }

}


class Configuration extends EngineConfiguration {

  constructor(...args) {
    super(...args);
    this._sessionStore    = 'cookieStore';
    this._sessionOptions  = Object.create(null);
    this._timeZone        = 'UTC';
    this._logLevel        = null;
    this._middleware      = this.appMiddleware;
    this._generators      = this.appGenerators;
  }

  get paths() {
    return this._paths ?= (paths) => {
      paths.add('config/database',    { 'with': 'config/database.json' });
      paths.add('config/secrets',     { 'with': 'config/secrets.json' });
      paths.add('config/environment', { 'with': 'config/environment.json' });
      paths.add('log',                { 'with': `log/${Trek.env}.log` });
      paths.add('public');
      paths.add('tmp');
      return paths;
    }(super.paths);
  }

  get databaseConfiguration() {
  }

  get logLevel() {
    return this._logLevel ?= (Trek.env === 'production' ? 'inof' : 'debug');
  }

}



class Application extends Engine {

  constructor() {
    if (!(this instanceof Application)) { return new Application; }
    super();
  }

  get config() {
    return this._config || (this._config = new Configuration());
  }

  set config(configuration) {
    this._config = configuration;
  }

  // config/foo.js
  configFor(name) {
    console.log(this.paths.get('config').existent());
    //let file = path.resolve(this.paths.get('config'))
  }

  get defaultMiddlewareStack() {
    let defaultStack = new DefaultMiddlewareStack(this, this.config, this.paths);
    return defaultStack.buildStack();
  }

}

export {Configuration, Application};