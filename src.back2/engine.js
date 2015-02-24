import path from 'path';
import Root from './paths';
import Trekking from './trekking';
import {Configuration as TrekkingConfiguration} from './trekking';
import {MiddlewareStackProxy, Generators} from './configuration';

class MiddlewareStack {}

class Configuration extends TrekkingConfiguration {

  constructor(root = null) {
    super();
    this._root = root;
    // copy
    this._generators = Object.create(this.appGenerators);
  }

  get middleware() {
    return this._middleware || (this._middleware = new MiddlewareStackProxy);
  }

  generators(cb) {
    this._generators || (this._generators = new Generators);
    if (cb) {
      cb(this._generators);
    }
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

var generatePaths= (root) => {
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

  constructor() {
    this._app       = null;
    this._config    = null;
    this._envConfig = null;
    this._helpers   = null;
    this._routes    = null;
    super();
  }

  get app() {
    //this._app ?=
  }

  get config() {
    return this._config || (this._config = new Configuration());
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

  get routes() {
    //this._routes ? = 
    return this._routes;
  }

  endpoint(endpoint) {
    this._endpoint ?= null;
    if (endpoint) this._endpoint = endpoint;
    return this._endpoint;
  }

  get defaultMiddlewareStack() {
    return new MiddlewareStack();
  }

  exec(env) {
    //this.app.call(env);
  }



  loadConsole(app = this) {
    //runConsoleBlocks
  }
  loadRunner(app = this) {}
  loadTasks(app = this) {
    // require gulp
  }
  loadGenerators(app = this) {
  }


}

//export {Configuration};
export default Engine;
