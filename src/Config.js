/*!
 * trek - lib/Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import path from 'path';
import { EventEmitter } from 'events';
import { cloneDeep, isPlainObject } from 'lodash-node/modern/lang';
import { defaults, has } from 'lodash-node/modern/object';
import chalk from 'chalk';
import { valueForKeyPath, setValueForKeyPath, hasKeyPath } from './utils';
import Root from './paths';

/**
 * @class Config
 * @public
 */
class Config {

  /**
   * Initialize an app's config.
   *
   * @constructor
   * @param {Trek} app
   */
  constructor(app) {
    this.app = app;
    this.root = app.root;
    this.emitter = new EventEmitter();
    this.defaultSettings = Object.create(null);
    this.settings = Object.create(null);
  }

  /**
   * @private
   */
  initialize() {
    this.dotenv();
    this.load(this.paths.get('config/application').first);
    this.load(this.paths.get('config/environments').first);
  }

  /**
   * Delegates `process.env`.
   *
   * @public
   * @return {Object}
   */
  get env() {
    return process.env;
  }

  /**
   * Gets app's `paths`.
   *
   * @public
   * @return {Root}
   */
  get paths() {
    return this._paths || (this._paths = ((root) => {
      let paths = new Root(root);

      paths.add('app');
      paths.add('app/controllers');
      paths.add('app/models',           { glob: '*.js' });
      paths.add('app/services',         { glob: '*.js' });
      paths.add('app/views');

      paths.add('lib');

      paths.add('config');
      paths.add('config/application',   { with: 'config/application.js' });
      paths.add('config/environments',  { glob: `${Trek.env}.js` });
      paths.add('config/locales',       { glob: '*.{js,json}' });

      paths.add('config/database',      { with: 'config/database.js' });
      paths.add('config/secrets',       { with: 'config/secrets.js' });
      paths.add('config/session',       { with: 'config/session.js' });
      paths.add('config/routes',        { with: 'config/routes.js' });
      paths.add('config/middleware',    { with: 'config/middleware.js' });
      paths.add('config/global.js',     { with: 'config/global.js' });

      paths.add('log',                  { with: `log/${Trek.env}.log` });
      paths.add('public');
      paths.add('tmp');

      return paths;
    })(this.root));
  }

  /**
   * Gets the secrets settings.
   *
   * @public
   * @return {Object}
   */
  get secrets() {
    return this._secrets || (this._secrets = (() => {
      let allSecrets = {};
      let filepath = this.paths.get('config/secrets').first;
      try {
        allSecrets = require(filepath);
      } catch (e) {
        Trek.logger.warn(`Missing %s.`, chalk.red(filepath));
      }
      let secrets = allSecrets[Trek.env] || {};
      if (!secrets.secretKeyBase) {
        secrets.secretKeyBase = Trek.keys;
      }
      return secrets;
    })());
  }

  /**
   * Gets the session settings.
   *
   * @public
   * @return {Object}
   */
  get session() {
    let allSession = {};
    let filepath = this.paths.get('config/session').first;
    try {
      allSession = require(filepath);
    } catch (e) {
      Trek.logger.warn(`Missing %s.`, chalk.red(filepath));
    }
    let session = allSession[Trek.env] || {};
    return session;
  }

  /**
   * Gets the app public path.
   *
   * @public
   * @return {String}
   */
  get publicPath() {
    return this.paths.get('public').first;
  }

  /**
   * Gets the app views path.
   *
   * @public
   * @return {String}
   */
  get viewsPath() {
    return this.paths.get('app/views').first;
  }

  /**
   * Loads a config file.
   *
   * @method
   * @public
   * @param {String} filepath
   */
  load(filepath) {
    try {
      require(filepath)(this);
    } catch (e) {
      Trek.logger.warn(`${e}`);
    }
    Trek.logger.debug('Loaded %s.', chalk.green(path.relative(this.root, filepath)));
  }

  /**
   * Loads environment variables from .env for app.
   *
   * @method dotenv
   * @public
   */
  dotenv() {
    [
      '.env',
      `.env.${Trek.env}`
    ].forEach((env) => {
      let loaded = Trek.dotenv.config({
        path: `${this.root}/config/${env}`
      });
      if (!loaded) Trek.logger.debug('Missing %s.', chalk.red(env));
      else Trek.logger.debug('Loaded %s.', chalk.green(env));
    });
  }

  /**
   * Gets value with `keyPath`.
   *
   * @example
   *  let site = config.get('site')
   *  let sietUrl = config.get('site.url')
   *  let name = config.get('name', true)
   *  ```
   *
   * @method
   * @public
   * @param {String} keyPath
   * @param {Boolean} isDefault [optional]
   * @return {Mixed}
   */
  get(keyPath, isDefault = false) {
    let value, defaultValue;
    defaultValue = valueForKeyPath(this.defaultSettings, keyPath);
    if (!isDefault) value = valueForKeyPath(this.settings, keyPath);

    if (value) {
      value = cloneDeep(value);
      if (isPlainObject(value) && isPlainObject(defaultValue)) {
        defaults(value, defaultValue);
      }
    } else {
      value = cloneDeep(defaultValue);
    }

    return value;
  }

  /**
   * Sets value with a keyPath.
   *
   * @example
   *  config.set('site', {
   *    url: 'http://trekjs.com',
   *    title: 'TREK.JS'
   *  }, true)
   *
   * @method
   * @public
   * @param {String} keyPath
   * @param {Mixed} value
   * @param {Boolean} isDefault [optional]
   * @return {Mixed}
   */
  set(keyPath, value, isDefault) {
    setValueForKeyPath(
      isDefault ? this.defaultSettings : this.settings,
      keyPath,
      value
    );
  }

}

export default Config;
