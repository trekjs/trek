import fs from 'mz/fs';
import _debug from 'debug';
import { dirname, basename, extname, join, resolve } from 'path';

const debug = _debug('trek:view');

export default class View {

  constructor(name, opts = {}) {
    this.defaultEngine = opts.defaultEngine;
    this.ext = extname(name);
    this.name = name;
    this.root = opts.root;

    if (!this.ext && !this.defaultEngine) {
      throw new Error('No default engine was specified and no extension was provided.');
    }

    var fileName = name;

    if (!this.ext) {
      // get extension from default engine name
      this.ext = this.defaultEngine[0] !== '.'
        ? '.' + this.defaultEngine
        : this.defaultEngine;

      fileName += this.ext;
    }

    // store loaded engine
    this.engine = opts.engines.get(this.ext);

    this.fileName = fileName;
    // lookup path
    //this.path = yield this.lookup(fileName);
  }

  *getPath() {
    return this.path || (this.path = yield this.lookup(this.fileName));
  }

  *lookup(name) {
    var path;
    var roots = [].concat(this.root);

    debug('lookup "%s"', name);

    for (var i = 0; i < roots.length && !path; i++) {
      var root = roots[i];

      // resolve the path
      var loc = resolve(root, name);
      var dir = dirname(loc);
      var file = basename(loc);

      // resolve the file
      path = yield this.resolve(dir, file);
    }

    return path;
  }

  *render(options) {
    yield this.getPath();
    debug('render "%s"', this.path);
    return yield this.engine(this.path, options);
  }

  *resolve(dir, file) {
    var ext = this.ext;

    // <path>.<ext>
    var path = join(dir, file);
    var stat = yield tryStat(path);

    if (stat && stat.isFile()) {
      return path;
    }

    // <path>/index.<ext>
    path = join(dir, basename(file, ext), 'index' + ext);
    stat = yield tryStat(path);

    if (stat && stat.isFile()) {
      return path;
    }
  }

}


function *tryStat(path) {
  debug('stat "%s"', path);

  try {
    return yield fs.stat(path);
  } catch (e) {
    return undefined;
  }
}
