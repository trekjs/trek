import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import isObject from 'lodash-node/modern/lang/isObject';
import isFunction from 'lodash-node/modern/lang/isFunction';
import RouteMapper from 'route-mapper';
import { Root } from './paths';
import { MiddlewareStack } from './stack';
import { MiddlewareStackProxy, Generators } from './configuration';
import { Trekking, Configuration as TrekkingConfiguration } from './trekking';

class Configuration extends TrekkingConfiguration {

  constructor(root = null) {
    super();
    this._root = root;
    // copy from `appGenerators`
    this._generators = Object.create(this.appGenerators);
  }

  get middleware() {
    return this._middleware || (this._middleware = new MiddlewareStackProxy);
  }

  set middleware(middleware) {
    this._middleware = middleware;
  }

  generators(cb) {
    this._generators ?= new Generators;
    if (isFunction(cb)) cb(this._generators);
    return this._generators;
  }

  get paths() {
    return this._paths || (this._paths = generatePaths(this._root));
  }

  get root() {
    return this._root;
  }

  set root(value) {
    return this._root = this.paths.path = path.resolve(value);
  }
}

var generatePaths = (root) => {
  let paths = new Root(root);

  paths.add('app');
  paths.add('app/controllers');
  paths.add('app/helpers');
  paths.add('app/models');
  paths.add('app/mailers');
  paths.add('app/views');

  paths.add('lib');
  paths.add('lib/tasks',            { glob: '**/*.gulp.js' });

  paths.add('config');
  paths.add('config/environments',  { glob: `${Trek.env}.js` });
  paths.add('config/locales',       { glob: '*.{js,yml}' });
  paths.add('config/routes.js');

  return paths;
};

class Engine extends Trekking {

  get calledFrom() {
    return path.dirname(require.main.filename);
  }

  find(path) {
    return path = path.resolve(path);
  }

  findRoot(from) {
    return this.findRootWithFlag('lib', from);
  }

  findRootWithFlag(flag, rootPath, _default) {
    if (rootPath) {
      while (fs.existsSync(rootPath)
        && fs.lstatSync(rootPath).isDirectory()
        && !fs.existsSync(`${rootPath}/${flag}`)) {
        let parent = path.dirname(rootPath);
        rootPath = parent !== rootPath && parent;
      }
    }

    let root = fs.existsSync(`${rootPath}/${flag}`) ? rootPath: _default;
    if (!root) {
      throw new Error(`Could not find root path for ${this}`);
    }

    return fs.realpathSync(root);
  }

  constructor() {
    this._app       = null;
    this._config    = null;
    this._envConfig = null;
    this._helpers   = null;
    this._routes    = null;
    super();
  }

  get config() {
    return this._config ||
      (this._config = new Configuration(this.findRoot(this.calledFrom)));
  }

  get middleware() {
    return this.config.middleware;
  }

  get root() {
    return this.config.root;
  }

  get paths() {
    return this.config.paths;
  }

  // Returns all registered helpers paths.
  get helpersPaths() {
    return this.paths.get('app/helpers').existent;
  }

  get routes() {
    return this._routes || (this._routes = new RouteMapper);
  }

  get envConfig() {
    return this._envConfig || (this._envConfig = {
      routes: this.routes
    });
  }

  // Returns the underlying koa application for this engine.
  get app() {
    return this._app || (this._app = () => {
      let app = new Koa;
      app.env = Trek.env;
      this.config.middleware = this.config.middleware.mergeInto(this.defaultMiddlewareStack);
      app.use(this.config.middleware.build(app));
      return app;
    }());
  }

  /*
  get endpoint() {
    return this._endpoint ?= new Koa;
  }

  set endpoint(endpoint) {
    return this._endpoint = endpoint;
  }
  */

  // callback or call, run
  run(env = {}) {
    if (isObject(env)) env = Object.assign(env, this.envConfig);
    this.app.listen(env.port || 3000);
  }

  get defaultMiddlewareStack() {
    return new MiddlewareStack();
  }

}

export { Engine, Configuration };