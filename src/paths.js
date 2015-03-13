import fs from 'fs';
import path from 'path';
import glob from 'glob';
import uniq from 'lodash-node/modern/array/uniq';

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

  get(path) {
    return this.root[path];
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
    this.options = options;
    this.glob = options.glob;
  }

  get children() {
    let keys = this.root.keys.filter((k) => {
      return k.startsWith(this.current) && k !== this.current;
    });
    return keys.map((k) => this.root[k]);
  }

  get path() {
    return path.join(this.root.path, this.current);
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

  push(path) {
    this.paths.push(path);
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
      p = path.join(this.root.path, p);

      if (this.glob && fs.existsSync(p) && fs.lstatSync(p).isDirectory()) {
        result = result.concat(
          glob.sync(this.glob, { cwd: p }).map(_p => path.join(p, _p))
        );
      } else {
        result.push(p);
      }
    });
    return result;
  }

  get existent() {
    return this.expanded().filter(f => fs.existsSync(f));
  }

  get existentDirectories() {
    return this.expanded().filter(f => fs.existsSync(f) && fs.lstatSync(f).isDirectory());
  }

}

export {
  Root,
  Path
};