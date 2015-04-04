/*!
 * trek - Paths
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import path from 'path';

class Paths {

  constructor(root) {
    this.root = root;
    this.blueprint = new Map();
    this.initialize();
  }

  initialize() {
    this
      .set('app')
      .set('app/controllers')
      .set('app/models')
      .set('app/views')
      .set('app/sevices')

      .set('lib')

      .set('config')
      .set('config/app',        { with: 'config/app.toml' })
      .set(`config/app.env`,    { with: `config/app.${Trek.env}.toml` })
      .set('config/.env',       { with: 'config/.env' })
      .set('config/.env.env',   { with: `config/.env.${Trek.env}` })
      .set('config/database',   { with: 'config/database.toml' })
      .set('config/secrets',    { with: 'config/secrets.toml' })
      .set('config/routes',     { with: 'config/routes.js' })
      .set('config/middleware', { with: 'config/middleware.js' })
      .set('config/locales')

      .set('public')
      .set('log',               { with: `log/${Trek.env}.log` })
      .set('tmp');
  }

  get(key, absolute = false) {
    if (!this.blueprint.has(key)) return null;
    let value = this.blueprint.get(key);
    return path.join(absolute ? this.root : '', value.with || value);
  }

  set(key, value) {
    value = value || key;
    this.blueprint.set(key, value);
    return this;
  }

}

export default Paths;
