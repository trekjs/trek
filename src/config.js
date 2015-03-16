/*!
 * trek/config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import {
  cloneDeep,
  isPlainObject
} from 'lodash-node/modern/lang';
import {
  defaults,
  has
} from 'lodash-node/modern/object';
import {
  valueForKeyPath,
  setValueForKeyPath,
  hasKeyPath
} from './utils';
import chalk from 'chalk';
import { Root } from './paths';

/**
 * @class Config
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
    this.emitter = new EventEmitter;
    this.defaultSettings = Object.create(null);
    this.settings = Object.create(null);
  }

  /**
   * @api private
   */
  initialize() {
    this.load(this.paths.get('config/application').first);
    this.load(this.paths.get('config/environments').first);
  }

  /**
   * Delegates `process.env`.
   *
   * @property
   * @return {Object}
   * @api public
   */
  get env() {
    return process.env;
  }

  /**
   * Gets app's paths.
   *
   * @property
   * @api public
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

      paths.add('log',                  { with: `log/${Trek.env}.log` });
      paths.add('public');
      paths.add('tmp');

      return paths;
    })(this.root));
  }

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

  get publicPath() {
    return this.paths.get('public').first;
  }

  get viewsPath() {
    return this.paths.get('app/views').first;
  }

  load(filepath) {
    Trek.logger.debug('Loading %s.', path.relative(this.root, filepath));
    try {
      require(filepath)(this);
    } catch (e) {
      Trek.logger.warn(`${e}`);
    }
  }

  get(keyPath, isDefault) {
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

  set(keyPath, value, isDefault) {
    setValueForKeyPath(
      isDefault ? this.defaultSettings : this.settings,
      keyPath,
      value
    );
  }

}

export default Config;