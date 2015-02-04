import path from 'path';
import fs from 'fs';
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
    this._helpersPaths    = [];
    this._sessionStore    = 'cookieStore';
    this._sessionOptions  = Object.create(null);
    this._timeZone        = 'UTC';
    this._logLevel        = null;
    this._middleware      = this.appMiddleware;
    this._generators      = this.appGenerators;
    this._secretKeyBase   = null;
  }

  get paths() {
    return this._paths ?= (paths) => {
      //paths.add('config/database',    { 'with': 'config/database.json' });
      paths.add('config/database',    { 'with': 'config/database.js' });
      //paths.add('config/secrets',     { 'with': 'config/secrets.json' });
      paths.add('config/secrets',     { 'with': 'config/secrets.js' });
      paths.add('config/environment', { 'with': 'config/environment.json' });
      paths.add('log',                { 'with': `log/${Trek.env}.log` });
      paths.add('public');
      paths.add('tmp');
      return paths;
    }(super.paths);
  }

  get databaseConfiguration() {
    let file = this.paths.get('config/database').existent[0];
    if (file) {
      file = path.resolve(file);
      if (fs.existsSync(file)) {
      }
    }
  }

  get logLevel() {
    return this._logLevel ?= (Trek.env === 'production' ? 'inof' : 'debug');
  }

  get helpersPaths() {
    return this._helpersPaths;
  }

  get secretKeyBase() {
    return this._secretKeyBase;
  }

}



class Application extends Engine {

  constructor() {
    if (!(this instanceof Application)) { return new Application; }
    super();
  }

  get config() {
    return this._config || (this._config = new Configuration(this.findRoot(this.calledFrom)));
  }

  set config(configuration) {
    this._config = configuration;
  }

  // config/foo.js
  configFor(name) {
    let file = this.paths.get('config').existent[0];
    let exist = false;
    if (file) {
      file = path.resolve(`${file}/${name}.json`);
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8') || '{}');
      }
    }
    if (!exist) {
      throw new Error(`Could not load configuration. No such file - ${file}`);
    }
  }

  get envConfig() {
    return this._appEnvConfig || (this.validateSecretKeyConfig(), this._appEnvConfig = Object.assign({}, super.envConfig, {
      secretKeyBase: this.secrets.secretKeyBase
    }));
  }

  get secrets() {
    return this._secrets || (this._secrets = () => {
      let secrets = {};
      let file = path.resolve(this.config.paths.get('config/secrets').first);
      if (fs.existsSync(file)) {
        let allSecrets = require(file);
        let envSecrets = allSecrets[Trek.env];
        if (envSecrets) {
          Object.assign(secrets, envSecrets);
        }
      }
      secrets.secretKeyBase ?= this.config.secretKeyBase;

      return secrets;
    }());
  }

  set secrets(secrets) {
    this._secrets = secrets;
  }

  get helpersPaths() {
    return this.config.helpersPaths;
  }

  validateSecretKeyConfig() {
    if (!this.secrets.secretKeyBase) {
      throw new Error(`Missing \`secretKeyBase\` for '${Trek.env}' environment, set these values in \`config/secrets.js\``);
    }
  }

  get defaultMiddlewareStack() {
    let defaultStack = new DefaultMiddlewareStack(this, this.config, this.paths);
    return defaultStack.buildStack();
  }

}

export {Configuration, Application};