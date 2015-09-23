/*!
 * trek - Config
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import { extname} from 'path'
import { readFile } from 'mz/fs'
import { Env, Memory } from 'nconf'
import chalk from 'chalk'
import dotenv from 'dotenv'
import templatly from 'templatly'
import Paths from './Paths'
import Parsers from './Parsers'

/**
 * The app's configuration
 *
 * @example
 *
 *  const config = new Config('./your-config-folder')
 */
export default class Config {

  /**
   * @param {String} root The app's root path
   * @param {String} [separator='.'] The keypath separator
   */
  constructor(root, separator = '.') {
    this.root = root
    this.separator = separator
    this.initialize()
  }

  /**
   * @private
   */
  initialize() {
    this.parsers = Parsers
    this.paths = new Paths(this.root)
    // init stores
    this.stores = new Map()
    // init list
    this.list = [
      // key, namespace, init store, enable/disable namespace, env
      ['config/database', 'database', null, true, Trek.env],
      ['config/secrets', 'secrets', null, true, Trek.env],
      ['config/app.env', 'user'], // app.${Trek.env}
      ['config/app', 'global'],
      ['config/.env', 'env', new Env()], // .env.${Trek.env}
    ]
  }

  /**
   * Load dotenv `.env.{development|test|production}`
   *
   * @example
   *
   *  config.dotenv()
   *
   * @returns {void}
   */
  dotenv() {
    let env = this.paths.get('config/.env') // .env.${Trek.env}
    let existed = !!env
    let loaded = false
    if (existed) {
      loaded = dotenv.config({
        path: `${this.root}/${env}`,
        silent: true
      })
    }
    env = env || this.paths.getPattern('config/.env')
    if (loaded) Trek.logger.debug('Loaded environment variables from %s to %s.', chalk.green(env), chalk.gray('process.env'))
    else Trek.logger.warn('Missing %s dotenv file or parse failed.', chalk.red(env))
  }

  /**
   * Load app.toml app.{development|test|production}.toml
   *
   * @example
   *
   *  yield config.loadList()
   *
   * @returns {void}
   */
  *loadList() {
    let tmp = []

    for (let item of this.list) {
      let [k, t, nc, n, e] = item
      let p = this.paths.get(k)
      let [existed, loaded, err] = [!!(p || nc), true, null]
      if (existed) {
        try {
          let s = nc || (yield this.compile(`${this.root}/${p}`, n ? t : null, e))
          this.stores.set(t, s)
        } catch (e) {
          err = e
          loaded = false
        }
      }
      tmp.unshift({
        pattern: this.paths.getPattern(k),
        filename: p,
        loaded: existed & loaded,
        error: err,
        namespace: t
      })
    }

    for (let [k, s] of this.stores.entries()) {
      s.loadSync()
    }

    tmp.forEach((e) => {
      let {
        pattern, filename, loaded, error, namespace
      } = e
      filename = (namespace === 'env' ? 'process.env': filename) || pattern
      if (loaded) Trek.logger.debug('Loaded %s.', chalk.green(filename))
      else Trek.logger.warn('Missing %s or parse failed, %s.', chalk.red(filename), chalk.red(error))
    })
  }

  /**
   * Load dotenv and app config files
   *
   * @example
   *
   *  yield config.load()
   *  // load steps
   *  // 0. config.dotenv()
   *  // 1. yield config.loadList()
   *
   * @returns {void}
   */
  *load() {
    // first, load dotenv
    this.dotenv()
    // second, load list
    yield this.loadList()
  }

  /**
   * Use templatly to render thie file, then parse file to Memory
   *
   * @example
   *
   *  yield config.compile('./your-config.json', 'user', 'test')
   *
   * @param {String} filename The file path
   * @param {String} namespace Set a namespace for current store
   * @param {String} env Select env if you want
   * @returns {nconf.Memory}
   */
  *compile(filename, namespace, env) {
    let content = yield this.render(filename)
    let data = this.parse(content, filename)
    let memory = new Memory({
      logicalSeparator: this.separator
    })
    // select env
    if (env) {
      data = data[env] || data
    }
    // add namespace for data
    if (namespace) {
      data = {
        [namespace]: data
      }
    }
    memory.store = data || Object.create(null)
    return memory
  }

  /**
   * First, uses native `template-strings` for rendering configuration file
   *
   * @example
   *
   *  yield config.render('./your-config.yml', { name: 'your-app-name' })
   *
   * @param {String} filename The config file path
   * @param {Object} locals An object whose properties define local variables for the configuration
   * @returns {String} The rendered template strings
   */
  *render(filename, locals = Object.create(null)) {
    let content = yield readFile(filename, 'utf-8')
    Object.assign(locals, {
      env: process.env,
      config: this
    })
    return templatly(content, locals)
  }

  /**
   * Parse the file from `.js`, `.json`, `.toml`, `.yml` formatters.
   *
   * @example
   *
   *  config.parse(content, filename)
   *
   * @param {String} content The file raw content
   * @param {String} filename The file path
   * @returns {nconf.Memory}
   */
  parse(content, filename) {
    let ext = extname(filename).substring(1)
    // parser
    let p = this.parsers[ext]
    if (!p) return Object.create(null)
    return p.parse(content, filename)
  }

  /**
   * Assigns setting key to value
   *
   * @example
   *
   *  config.set('port', 8080)
   *  config.set('app.name', 'trek')
   *
   * @param {String} key
   * @param {*} value
   * @param {String} [type='user'] The namespace is `user` by default
   * @returns {Config} this
   */
  set(key, value, type = 'user') {
    if (this.stores.has(type)) {
      this.stores.get(type).set(key, value)
    }
    return this
  }

  /**
   * Get value by key from Config
   *
   * @example
   *
   *  // search: env -> user -> global
   *  config.get('host')
   *  config.get('port', 80) // 80 by default
   *
   * @param {String} key
   * @param {*} [defaultValue]
   * @returns {*}
   */
  get(key, defaultValue) {
    let value
    for (let s of this.stores.values()) {
      value = s.get(key)
      if (value) return value
    }
    return defaultValue
  }

}
