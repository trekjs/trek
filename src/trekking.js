import isFunction from 'lodash-node/modern/lang/isFunction';
import { MiddlewareStackProxy, Generators } from './configuration';

class Configuration {

  constructor() {
    Configuration.options ?= []
  }

  get appMiddleware() {
    return Configuration.appMiddleware ?= new MiddlewareStackProxy;
  }

  get appGenerators() {
    return Configuration.appGenerators ?= new Generators;
  }

  beforeConfiguration(cb) {}

  beforeInitialize(cb) {}

  afterInitialize(cb) {}

}

class Trekking {

  static generators(cb) {
    this._generators || (this._generators = []);
    if (isFunction(cb)) {
      this._generators.push(cb);
    }
    return this._generators;
  }

  static get instance() {
    return this._instance || (this._instance = new Trekking);
  }

  static configure(cb) {
    this._instance.configure(cb);
  }

  constructor() {}

  configure(cb) {
    cb.call(this);
  }

  get config() {
    return this._config || (this._config = new Configuration);
  }

}

export { Trekking, Configuration };