"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var uniq = _interopRequire(require("lodash-node/modern/array/uniq"));

var path = _interopRequire(require("path"));

var fs = _interopRequire(require("fs"));

var glob = _interopRequire(require("glob"));

var Root = (function () {
  function Root(path) {
    this.current = null;
    this.path = path;
    this.root = Object.create(null);
  }

  _prototypeProperties(Root, null, {
    set: {
      value: function set(path, value) {
        var glob = this.path ? this.page.glob : null;
        this.add(path, { "with": value, glob: glob });
      },
      writable: true,
      configurable: true
    },
    get: {
      value: function get(path) {
        return this.root[path];
      },
      writable: true,
      configurable: true
    },
    add: {
      value: function add(path) {
        var options = arguments[1] === undefined ? Object.create(null) : arguments[1];
        var _with = [].concat(options["with"] || path);
        this.root[path] = new Path(this, path, _with, options);
      },
      writable: true,
      configurable: true
    },
    keys: {
      get: function () {
        return Object.keys(this.root);
      },
      configurable: true
    },
    values: {
      get: function () {
        var _this = this;
        return this.keys.map(function (k) {
          return _this.root[k];
        });
      },
      configurable: true
    },
    allPaths: {
      get: function () {
        return uniq(this.values);
      },
      configurable: true
    }
  });

  return Root;
})();

var Path = (function () {
  function Path(root, current, paths) {
    var options = arguments[3] === undefined ? Object.create(null) : arguments[3];
    this.root = root;
    this.current = current;
    this.paths = paths;
    //this.options = options;
    this.glob = options.glob;
  }

  _prototypeProperties(Path, null, {
    children: {
      get: function () {
        var _this = this;
        var keys = this.root.keys.filter(function (k) {
          return k.startsWith(_this.current) && k !== _this.current;
        });
        return keys.map(function (k) {
          return _this.root[k];
        });
      },
      configurable: true
    },
    first: {
      get: function () {
        return this.expanded()[0];
      },
      configurable: true
    },
    last: {
      get: function () {
        var paths = this.expanded();
        return paths[paths.length - 1];
      },
      configurable: true
    },
    each: {
      value: function each(cb) {
        this.paths.forEach(cb);
      },
      writable: true,
      configurable: true
    },
    push: {
      value: function push(path) {
        this.paths.push(path);
      },
      writable: true,
      configurable: true
    },
    concat: {
      value: function concat(paths) {
        this.paths.concat(paths);
      },
      writable: true,
      configurable: true
    },
    toArray: {
      value: function toArray() {
        return this.paths;
      },
      writable: true,
      configurable: true
    },
    expanded: {
      value: function expanded() {
        var _this = this;
        if (!this.root.path) {
          throw new Error("You need to set a path root");
        }

        var result = [];
        this.each(function (p) {
          p = path.relative(_this.root.path, p);

          if (_this.glob && fs.existsSync(p) && fs.lstatSync(p).isDirectory()) {
            process.chdir(p);
            result = result.concat(glob.sync(_this.glob).map(function (_p) {
              return path.join(p, _p);
            }));
          } else {
            result.push(p);
          }
        });
        return result;
      },
      writable: true,
      configurable: true
    },
    existent: {
      value: function existent() {
        return this.expanded().filter(function (f) {
          return fs.existsSync(f);
        });
      },
      writable: true,
      configurable: true
    },
    existentDirectories: {
      value: function existentDirectories() {
        return this.expanded().filter(function (f) {
          return fs.existsSync(f) && fs.lstatSync(f).isDirectory();
        });
      },
      writable: true,
      configurable: true
    }
  });

  return Path;
})();

exports.Root = Root;
exports.Path = Path;
exports.__esModule = true;