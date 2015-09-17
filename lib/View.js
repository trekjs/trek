/*!
 * trek - View
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mzFs = require('mz/fs');

var _mzFs2 = _interopRequireDefault(_mzFs);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

var _path = require('path');

const debug = _debug3['default']('trek:view');

var View = (function () {
  function View(name) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, View);

    this.defaultEngine = opts.defaultEngine;
    this.ext = _path.extname(name);
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

  View.prototype.fetchPath = function* fetchPath() {
    return this.path || (this.path = yield this.lookup(this.fileName));
  };

  View.prototype.lookup = function* lookup(name) {
    var path;
    var roots = [].concat(this.root);

    debug('lookup "%s"', name);

    for (var i = 0; i < roots.length && !path; i++) {
      var root = roots[i];

      // resolve the path
      var loc = _path.resolve(root, name);
      var dir = _path.dirname(loc);
      var file = _path.basename(loc);

      // resolve the file
      path = yield this.resolve(dir, file);
    }

    return path;
  };

  View.prototype.render = function* render(options) {
    yield this.fetchPath();
    debug('render "%s"', this.path);
    return yield this.engine(this.path, options);
  };

  View.prototype.resolve = function* resolve(dir, file) {
    var ext = this.ext;

    // <path>.<ext>
    var path = _path.join(dir, file);
    var stat = yield tryStat(path);

    if (stat && stat.isFile()) {
      return path;
    }

    // <path>/index.<ext>
    path = _path.join(dir, _path.basename(file, ext), 'index' + ext);
    stat = yield tryStat(path);

    if (stat && stat.isFile()) {
      return path;
    }
  };

  return View;
})();

exports['default'] = View;

function* tryStat(path) {
  debug('stat "%s"', path);

  try {
    return yield _mzFs2['default'].stat(path);
  } catch (e) {
    return undefined;
  }
}
module.exports = exports['default'];