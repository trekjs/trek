
import Application from './trekking/application';
import path from 'path';

class Trek {

  get application() {
    this._application ?= new Application();
  }

  configuration() {
  }

  root() {
    //this.application && this.application.config.root();
  }

  get env() {
    return this._env ?= new StringInquirer(process.env.TREK_ENV || process.env.IOJS_ENV || 'development');
  }

  set env(environment) {
    return this._env = new StringInquirer(environment);
  }

  get groups(groups) {
  }

  get publicPath() {
  }

}

export default Trek;