"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var glob = _interopRequire(require("glob"));

var uniq = _interopRequire(require("lodash-node/modern/array/uniq"));

let Root = (function () {
  function Root(path) {
    _classCallCheck(this, Root);

    this.current = null;
    this.path = path;
    this.root = Object.create(null);
  }

  _createClass(Root, {
    set: {
      value: function set(path, value) {
        var glob = this.path ? this.page.glob : null;
        this.add(path, { "with": value, glob: glob });
      }
    },
    get: {
      value: function get(path) {
        return this.root[path];
      }
    },
    add: {
      value: function add(path) {
        let options = arguments[1] === undefined ? Object.create(null) : arguments[1];

        var _with = [].concat(options["with"] || path);
        this.root[path] = new Path(this, path, _with, options);
      }
    },
    keys: {
      get: function () {
        return Object.keys(this.root);
      }
    },
    values: {
      get: function () {
        var _this = this;

        return this.keys.map(function (k) {
          return _this.root[k];
        });
      }
    },
    allPaths: {
      get: function () {
        return uniq(this.values);
      }
    }
  });

  return Root;
})();

let Path = (function () {
  function Path(root, current, paths) {
    let options = arguments[3] === undefined ? Object.create(null) : arguments[3];

    _classCallCheck(this, Path);

    this.root = root;
    this.current = current;
    this.paths = paths;
    this.options = options;
    this.glob = options.glob;
  }

  _createClass(Path, {
    children: {
      get: function () {
        var _this = this;

        let keys = this.root.keys.filter(function (k) {
          return k.startsWith(_this.current) && k !== _this.current;
        });
        return keys.map(function (k) {
          return _this.root[k];
        });
      }
    },
    first: {
      get: function () {
        return this.expanded()[0];
      }
    },
    last: {
      get: function () {
        let paths = this.expanded();
        return paths[paths.length - 1];
      }
    },
    each: {
      value: function each(cb) {
        this.paths.forEach(cb);
      }
    },
    push: {
      value: function push(path) {
        this.paths.push(path);
      }
    },
    concat: {
      value: function concat(paths) {
        this.paths.concat(paths);
      }
    },
    toArray: {
      value: function toArray() {
        return this.paths;
      }
    },
    expanded: {
      value: function expanded() {
        var _this = this;

        if (!this.root.path) {
          throw new Error("You need to set a path root");
        }

        let result = [];
        this.each(function (p) {
          p = path.join(_this.root.path, p);

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
      }
    },
    existent: {
      get: function () {
        return this.expanded().filter(function (f) {
          return fs.existsSync(f);
        });
      }
    },
    existentDirectories: {
      get: function () {
        return this.expanded().filter(function (f) {
          return fs.existsSync(f) && fs.lstatSync(f).isDirectory();
        });
      }
    }
  });

  return Path;
})();

exports.Root = Root;
exports.Path = Path;
Object.defineProperty(exports, "__esModule", {
  value: true
});