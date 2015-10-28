/*!
 * trek - View
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mzFs = require('mz/fs');

var _mzFs2 = _interopRequireDefault(_mzFs);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _path = require('path');

const debug = (0, _debug3['default'])('trek:view');

/**
 * Initialize a new `View` with the given `name`
 */

class View {

  /**
   * @param {String} name
   * @param {Object} options
   * @param {String} options.defaultEngine The default template engine name
   * @param {Object} options.engines Template engine require() cache
   * @param {String} options.root The Root path for view lookup
   */
  constructor(name) {
    let opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.defaultEngine = opts.defaultEngine;
    this.ext = (0, _path.extname)(name);
    this.name = name;
    this.root = opts.root;

    if (!this.ext && !this.defaultEngine) {
      throw new Error('No default engine was specified and no extension was provided.');
    }

    var fileName = name;

    if (!this.ext) {
      // get extension from default engine name
      this.ext = this.defaultEngine[0] !== '.' ? '.' + this.defaultEngine : this.defaultEngine;

      fileName += this.ext;
    }

    // store loaded engine
    this.engine = opts.engines.get(this.ext);

    // store filename
    this.fileName = fileName;
  }

  /**
   * Lazy fetch the file path
   *
   * @returns {string} The file path
   */
  *fetchPath() {
    return this.path || (this.path = yield this.lookup(this.fileName));
  }

  /**
   * Lookup view by the given `name`
   *
   * @param {String} name The file name
   * @returns {String} The file path
   */
  *lookup(name) {
    var path;
    var roots = [].concat(this.root);

    debug(`lookup "${ name }"`);

    for (var i = 0; i < roots.length && !path; i++) {
      var root = roots[i];

      // resolve the path
      var loc = (0, _path.resolve)(root, name);
      var dir = (0, _path.dirname)(loc);
      var file = (0, _path.basename)(loc);

      // resolve the file
      path = yield this.resolve(dir, file);
    }

    return path;
  }

  /**
   * Render with the given options
   *
   * @param {Object} options
   * @returns {String} The rendered template string
   */
  *render(options) {
    yield this.fetchPath();
    debug(`render "${ this.path }"`);
    return yield this.engine(this.path, options);
  }

  /**
   * Resolve the file within the given directory
   *
   * @param {String} dir
   * @param {String} file
   * @returns {String} The resolved file path
   */
  *resolve(dir, file) {
    var ext = this.ext;

    // <path>.<ext>
    var path = (0, _path.join)(dir, file);
    var stat = yield tryStat(path);

    if (stat && stat.isFile()) {
      return path;
    }

    // <path>/index.<ext>
    path = (0, _path.join)(dir, (0, _path.basename)(file, ext), `index${ ext }`);
    stat = yield tryStat(path);

    if (stat && stat.isFile()) {
      return path;
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
exports['default'] = View;
function* tryStat(path) {
  debug(`stat "${ path }"`);

  try {
    return yield _mzFs2['default'].stat(path);
  } catch (e) {
    return;
  }
}
module.exports = exports['default'];