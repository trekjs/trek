import path from 'path';
import isObject from 'lodash-node/modern/lang/isObject';
import compact from 'lodash-node/modern/array/compact';
import uniq from 'lodash-node/modern/array/uniq';
import { Application } from './application';

var Trek = {

  get application() {
    return this._application || (this._application = new Application);
  },

  set application(application) {
    this._application = application;
  },

  get configuration() {
    return this.application.config;
  },

  get root() {
    return this.application && this.application.config.root;
  },

  get env() {
    return this._env ?= (
      process.env.TREK_ENV ||
      process.env.IOJS_ENV ||
      process.env.NODE_ENV ||
      'development');
  },

  set env(environment) {
    return this._env = environment;
  },

  groups(...groups) {
    let hash = isObject(groups[groups.length - 1]) ? groups.pop() : {};
    let env = Trek.env;
    groups.unshift('default', env);
    return uniq(compact(groups
      .concat((process.env.TREK_GROUPS || '').split(','))
      .concat(Object.keys(hash).filter(k => { return hash[k].includes(env); }))
    ));
  },

  get publicPath() {
    return this.application && path.resolve(this.application.paths.get('public').first);
  }

}

// export Trek to Global
export default (global.Trek = Trek);