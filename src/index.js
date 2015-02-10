import isObject from 'lodash-node/modern/lang/isObject';
import compact from 'lodash-node/modern/array/compact';
import uniq from 'lodash-node/modern/array/uniq';
import path from 'path';
import {Application} from './application';

class Trek {

  static get application() {
    return this._application || (this._application = new Application);
  }

  static set application(application) {
    this._application = application;
  }

  static get configuration() {
    return this.application.config;
  }

  static get root() {
    return this.application && this.application.config.root;
  }

  static get env() {
    return this._env ?= (process.env.TREK_ENV
      || process.env.IOJS_ENV
      || process.env.NODE_ENV
      || 'development');
  }

  static set env(environment) {
    return this._env = environment;
  }

  static groups(...groups) {
    let hash = isObject(groups[groups.length - 1]) ? groups.pop() : {};
    let env = Trek.env;
    groups.unshift('default', env);
    return uniq(compact(groups
      .concat((process.env.TREK_GROUPS || '').split(','))
      .concat(
        Object.keys(hash)
          .filter(k => { return hash[k].includes(env); })
      )));
  }

  static get publicPath() {
    return this.application && path.resolve(this.application.paths.get('public').first);
  }

}

// export Trek to Global
export default (global.Trek = Trek);
