import uniq from 'lodash-node/modern/array/uniq';
import path from 'path';
import fs from 'fs';
import glob from 'glob';

class Root {

  constructor(path) {
    this.current = null;
    this.path = path;
    this.root = Object.create(null);
  }

  set(path, value) {
    var glob = this.path ? this.page.glob : null;
    this.add(path, { 'with': value, glob: glob });
  }

  add(path, options = Object.create(null)) {
    var _with = [].concat(options['with'] || path);
    this.root[path] = new Path(this, path, _with, options);
  }

  get keys() {
    return Object.keys(this.root);
  }

  get values() {
    return this.keys.map(k => this.root[k]);
  }

  get allPaths() {
    return uniq(this.values);
  }

}

class Path {

  constructor(root, current, paths, options = Object.create(null)) {
    this.root = root;
    this.current = current;
    this.paths = paths;
    //this.options = options;
    this.glob = options.glob;
  }

  get children() {
    let keys = this.root.keys.filter((k) => {
      return k.startsWith(this.current) && k !== this.current;
    });
    return keys.map((k) => this.root[k]);
  }

  get first() {
    return this.expanded()[0];
  }

  get last() {
    let paths = this.expanded();
    return paths[paths.length - 1];
  }

  each(cb) {
    this.paths.forEach(cb);
  }

  concat(paths) {
    this.paths.concat(paths);
  }

  toArray() {
    return this.paths;
  }

  expanded() {
    if (!this.root.path) {
      throw new Error('You need to set a path root');
    }

    let result = [];
    this.each(p => {
      p = path.relative(this.root.path, p);

      if (this.glob && fs.existsSync(p) && fs.lstatSync(p).isDirectory()) {
        process.chdir(p);
        result = result.concat(glob.sync(this.glob).map(_p => path.join(p, _p)));
      } else {
        result.push(p);
      }
    });
    return result;
  }

  existent() {
    return this.expanded().filter(f => fs.existsSync(f));
  }

  existentDirectories() {
    return this.expanded().filter(f => fs.existsSync(f) && fs.lstatSync(f).isDirectory());
  }


}

export {Path};
export default Root;
