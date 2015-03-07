import fs from 'fs';
import path from 'path';
import {
  cloneDeep,
  isPlainObject
} from 'lodash-node/modern/lang';
import defaults from 'lodash-node/modern/object/defaults';
import _debug from 'debug';
import chalk from 'chalk';
import { EventEmitter } from 'events';
import { valueForKeyPath, setValueForKeyPath, hasKeyPath } from './utils';
import { Root } from './paths';

const debug = _debug('trek:config');

class Config {

  constructor(root) {
    this.root = root;
    this.emitter = new EventEmitter;
    this.defaultSettings = Object.create(null);
    this.settings = Object.create(null);
  }

  get paths() {
    return this._paths
      || (this._paths = (root) => {
        let paths = new Root(root);

        paths.add('app');
        paths.add('app/controllers');
        paths.add('app/models');
        paths.add('app/views');

        paths.add('lib');
        paths.add('config');
        paths.add('config/application',   { with: 'config/application.js' });
        paths.add('config/environments',  { glob: `${Trek.env}.js` });
        paths.add('config/secrets',       { glob: `${Trek.env}.js` });
        paths.add('config/locales',       { glob: '*.{js,json}' });
        paths.add('config/routes',        { with: 'config/routes.js' });

        paths.add('public');
        paths.add('log',                  { with: `log/${Trek.env}.log` });
        paths.add('tmp');

        return paths;
      }(this.root));
  }

  get secrets() {
    return this._secrets
      || (this._secrets = () => {
        let secrets = {};
        let filepath = this.paths.get('config/secrets').first;
        if (!filepath) return filepath;
        let file = path.resolve(filepath);
        if (fs.existsSync(file)) {
          secrets = require(file);
        }
        secrets.secretKeyBase ?= this.secretKeyBase;
        return secrets;
      }());
  }

  get publicPath() {
    return this.paths.get('public').first;
  }

  get viewsPath() {
    return this.paths.get('app/views').first;
  }

  load(path) {
    debug('load %s', path);
    try {
      require(path)(this);
    } catch(e) {
      console.log(chalk.bold.red(`Missing ${path} file or syntax error: ${e}.`));
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