/*!
 * trek
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

import fs from 'fs';
import path from 'path';
import has from 'lodash-node/modern/object/has';
import chalk from 'chalk';
import co from 'co';
import winston from 'winston';
import Koa from 'koa';
import _debug from 'debug';
//import RouteMapper from 'route-mapper';
import Config from './config';
import extraContext from './context';
import { defaultStack } from './stack';

const debug = _debug('trek');

class Trek extends Koa {

  static get env() {
    return this._env || (
      process.env.TREK_ENV ||
      process.env.IOJS_ENV ||
      process.env.NODE_ENV ||
      'development');
  }

  static get package() {
    return this._package || (this._package = require('../package'));
  }

  static get version() {
    return this.package.version;
  }

  get calledFrom() {
    return this._calledFrom
      || (this._calledFrom = path.dirname(require.main.filename));
  }

  set calledFrom(path) {
    this._calledFrom = path;
  }

  findRoot(from) {
    return this.findRootWithFlag('lib', from);
  }

  findRootWithFlag(flag, rootPath, _default) {
    if (rootPath) {
      while (fs.existsSync(rootPath) &&
        fs.lstatSync(rootPath).isDirectory() &&
        !fs.existsSync(`${rootPath}/${flag}`)) {
        let parent = path.dirname(rootPath);
        rootPath = parent !== rootPath && parent;
      }
    }

    let root = fs.existsSync(`${rootPath}/${flag}`) ? rootPath : _default;
    if (!root) {
      this.logger.error(`* Could not find root path for ${this}`);
    }

    return fs.realpathSync(root);
  }

  constructor(calledFrom) {
    if (calledFrom) this.calledFrom = calledFrom;

    debug('init %s', this.calledFrom);

    super()

    this.env = Trek.env;
    this.initialize();
  }

  initialize() {
    this.config.initialize();
    extraContext(this.context);
    defaultStack(this);
  }

  get config() {
    return this._config
      || (this._config = new Config(this.findRoot(this.calledFrom)));
  }

  set config(config) {
    this._config = config;
  }

  get root() {
    return this.config.root;
  }

  get paths() {
    return this.config.paths;
  }

  /*
  get routeMapper() {
    return this._routeMapper || (this._routeMapper = new RouteMapper);
  }
  */

  get cache() {
    return this._cache || (this._cache = new Map);
  }

  get services() {
    return this._services || (this._services = new Map);
  }

  getService(key) {
    return this.services.get(key);
  }

  setService(key, value) {
    this.logger.log('info', chalk.yellow('* Trek service:%s'), key);
    this.services.set(key, value);
  }

  get logger() {
    return this._logger || (this._logger = new(winston.Logger)({
      transports: [
        new(winston.transports.Console)({
          //prettyPrint: true,
          colorize: true,
          timestamp: true
        })
      ]
    }));
  }

  run() {
    let self = this;
    self.logger.info(chalk.green('* Trek booting ...'));
    let config = self.config;
    let servicesPath = self.paths.get('app/services').path
    return co(function* () {
      let seq = [];
      let files = self.paths.get('app/services').existent //(yield mzfs.readdir(servicesPath)).sort();
      for (let file of files) {
        let name = path.basename(file, '.js').replace(/^[0-9]+-/, '');
        let service = require(file)(self, config);
        self.setService(name, service);
        self.logger.info(chalk.green(`* Trek service:${name} init ...`));
        if (service.promise) yield service.promise;
        self.logger.info(chalk.green(`* Trek service:${name} booted`));
      }
    })
      .then(() => {
        // TODO: https
        let app = this.listen(...arguments);
        this.logger.info(
          chalk.green('* Trek %s application starting in %s on http://%s:%s'),
          Trek.version,
          Trek.env,
          app.address().address === '::' ? 'localhost' : app.address().address,
          app.address().port
        );
      })
      .catch((e) => {
        this.logger.error(chalk.bold.red(`${e}`));
        this.logger.error(chalk.red('* Trek boots failed.'));
      })
  }

}

if (!has(global, 'Trek')) global.Trek = Trek;

export default global.Trek;