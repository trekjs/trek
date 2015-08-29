/*!
 * trek - Paths
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import path from 'path';
import glob from 'glob';

/**
 *
 * @class Paths
 * @constructor
 * @param {String} root The app root path
 */
class Paths {

  constructor(root, formats = 'toml|json|js') {
    this.root = root;
    this.formats = formats;
    this.blueprint = new Map();
    this.initialize();
  }

  initialize() {
    this
      .set('app')
      .set('app/controllers')
      .set('app/models',         { glob: '*.js' })
      .set('app/views')
      .set('app/services',       { glob: '*.js' })

      .set('lib')

      .set('config')
      .set('config/app',        { glob: `config/app.?(${this.formats})` })
      .set(`config/app.env`,    { glob: `config/app.${Trek.env}.?(${this.formats})` })
      .set('config/.env',       { with: `config/.env.${Trek.env}` })
      .set('config/database',   { glob: `config/database.?(${this.formats})` })
      .set('config/secrets',    { glob: `config/secrets.?(${this.formats})` })
      .set('config/routes',     { with: 'config/routes.js' })
      .set('config/middleware', { with: 'config/middleware.js' })
      .set('config/locales')

      .set('public')
      .set('log',               { with: `log/${Trek.env}.log` })
      .set('tmp');
  }

  /**
   * Get the path with the key path from paths
   *
   * @method get
   * @memberof Paths.prototype
   * @param {String} key The key path
   * @param {Boolean} [absolute=false] Relative or absolute path
   * @return {String} path
   */
  get(key, absolute = false) {
    if (!this.blueprint.has(key)) return null;
    let value = this.blueprint.get(key);
    if (value.glob) {
      // TODO glob async
      return glob(value.glob, { sync: true, cwd: this.root })[0];
    }
    return path.join(absolute ? this.root : '', value.with || value);
  }

  /**
   * Set the value with the key path onto paths
   *
   * @method set
   * @memberof Paths.prototype
   * @param {String} key The key path
   * @param {Object|String} [value=key]
   * @return this
   */
  set(key, value) {
    value = value || key;
    this.blueprint.set(key, value);
    return this;
  }

}

export default Paths;
