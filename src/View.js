'use strict'

/*!
 * trek - View
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import fs from 'mz/fs'
import _debug from 'debug'
import { dirname, basename, extname, join, resolve } from 'path'

const debug = _debug('trek:view')

/**
 * Initialize a new `View` with the given `name`
 */
export default class View {

  /**
   * @param {String} name
   * @param {Object} options
   * @param {String} options.defaultEngine The default template engine name
   * @param {Object} options.engines Template engine require() cache
   * @param {String} options.root The Root path for view lookup
   */
  constructor(name, opts = {}) {
    this.defaultEngine = opts.defaultEngine
    this.ext = extname(name)
    this.name = name
    this.root = opts.root

    if (!this.ext && !this.defaultEngine) {
      throw new Error(
        'No default engine was specified and no extension was provided.'
      )
    }

    var fileName = name

    if (!this.ext) {
      // get extension from default engine name
      this.ext = this.defaultEngine[0] !== '.' ?
        '.' + this.defaultEngine : this.defaultEngine

      fileName += this.ext
    }

    // store loaded engine
    this.engine = opts.engines.get(this.ext)

    // store filename
    this.fileName = fileName
  }

  /**
   * Lazy fetch the file path
   *
   * @returns {string} The file path
   */
  *fetchPath() {
    return this.path || (this.path = yield this.lookup(this.fileName))
  }

  /**
   * Lookup view by the given `name`
   *
   * @param {String} name The file name
   * @returns {String} The file path
   */
  *lookup(name) {
    var path
    var roots = [].concat(this.root)

    debug(`lookup "${name}"`)

    for (var i = 0; i < roots.length && !path; i++) {
      var root = roots[i]

      // resolve the path
      var loc = resolve(root, name)
      var dir = dirname(loc)
      var file = basename(loc)

      // resolve the file
      path = yield this.resolve(dir, file)
    }

    return path
  }

  /**
   * Render with the given options
   *
   * @param {Object} options
   * @returns {String} The rendered template string
   */
  *render(options) {
    yield this.fetchPath()
    debug(`render "${this.path}"`)
    return yield this.engine(this.path, options)
  }

  /**
   * Resolve the file within the given directory
   *
   * @param {String} dir
   * @param {String} file
   * @returns {String} The resolved file path
   */
  *resolve(dir, file) {
    var ext = this.ext

    // <path>.<ext>
    var path = join(dir, file)
    var stat = yield tryStat(path)

    if (stat && stat.isFile()) {
      return path
    }

    // <path>/index.<ext>
    path = join(dir, basename(file, ext), `index${ext}`)
    stat = yield tryStat(path)

    if (stat && stat.isFile()) {
      return path
    }
  }

}

/**
 * Return a stat, maybe
 *
 * @param {String} path
 * @return {fs.Stats}
 * @private
 */
function* tryStat(path) {
  debug(`stat "${path}"`)

  try {
    return yield fs.stat(path)
  } catch (e) {
    return
  }
}
