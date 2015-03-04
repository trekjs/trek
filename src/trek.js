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
import Koa from 'koa';
import koaLoadMiddlewares from 'koa-load-middlewares';
import RouteMapper from 'route-mapper';
import Config from './config';
import { defaultStack } from './stack';

class Trek extends Koa {

  static get env() {
    return this._env ?= (
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

    let root = fs.existsSync(`${rootPath}/${flag}`) ? rootPath: _default;
    if (!root) {
      throw new Error(`Could not find root path for ${this}`);
    }

    return fs.realpathSync(root);
  }

  constructor() {
    super();
    this.env = Trek.env;
    this.initialize();
  }

  initialize() {
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

  get routeMapper() {
    return this._routeMapper || (this._routeMapper = new RouteMapper);
  }

  run(...args) {
    this.listen(...args);
  }

}

export default (global.Trek ?= Trek);