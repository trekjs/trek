'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _interopRequire = require('interop-require');

var _interopRequire2 = _interopRequireDefault(_interopRequire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Loader {

  constructor(app) {
    this.app = app;
  }

  get root() {
    return this.app.root;
  }

  load(plugins, root) {
    root = root || this.root;
    for (const key of plugins) {
      const Plugin = (0, _interopRequire2.default)((0, _path.resolve)(root, key));
      if (Plugin.install && !Plugin.installed) {
        const plugin = Plugin.install(this.app);
        this.app.plugins.set(key, plugin);
      }
    }
  }

  require(path, root) {
    return (0, _interopRequire2.default)((0, _path.resolve)(root || this.root, path));
  }

}
exports.default = Loader;