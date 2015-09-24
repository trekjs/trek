/*!
 * trek - Paths
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import path from 'path'
import glob from 'glob'
import _debug from 'debug'

const debug = _debug('trek:paths')

/**
 *
 */
export default class Paths {

  /**
   * @param {String} root The root path
   * @param {String} [formats='toml|json|js|yml'] The formats can parse and render
   */
  constructor(root, formats = 'toml|json|js|yml') {
    this.root = root
    this.formats = formats
    this.blueprint = new Map()
    this.initialize()
  }

  /**
   * @private
   */
  initialize() {
    this
      .set('app')
      .set('app/controllers')
      .set('app/models',        { glob: 'app/models/*.js', multi: true })
      .set('app/views')
      .set('app/services',      { glob: 'app/services/*.js', multi: true })

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
      .set('tmp')
  }

  /**
   * Get the path with the key path from paths
   *
   * @param {String} key The key path
   * @param {Boolean} [absolute=false] Relative or absolute path
   * @returns {String} path
   */
  get(key, absolute = false) {
    let value = this.blueprint.get(key) || key
    let pattern = value.glob || value.with || value
    let res = glob(pattern, { sync: true, realpath: absolute, cwd: this.root })
    return value.multi ? res : res[0]
  }

  /**
   * Set the `value` with the `key` path onto paths
   *
   * @param {String} key The key path
   * @param {Object|String} value [value=key]
   * @returns {Paths}
   */
  set(key, value) {
    value = value || key
    debug(`set "${key}"`)
    this.blueprint.set(key, value)
    return this
  }

  /**
   * Get the path pattern with the `key` path from paths
   *
   * @param {String} key The key path
   * @returns {String} The file path
   */
  getPattern(key) {
    if (!this.blueprint.has(key)) return null
    let value = this.blueprint.get(key)
    return value.with || value.glob || value
  }

}
