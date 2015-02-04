import path from 'path';
import {Application} from './application';

class Trek {

  static get env() {
    return this._env ?= (process.env.TREK_ENV || process.env.IOJS_ENV || process.env.NODE_ENV || 'development');
  }

  static set env(environment) {
    return this._env = environment;
  }

  static get application() {
    return this._application || (this._application = new Application);
  }

  static set application(application) {
    this._application = application;
  }

  static get groups(groups) {
  }

  static get publicPath() {
    return this.application && path.resolve(this.application.paths.get('public').first);
  }

}

// export Trek to Global
export default (global.Trek = Trek);
