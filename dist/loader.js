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

  require(path, root) {
    return (0, _interopRequire2.default)((0, _path.resolve)(root || this.root, path));
  }

}
exports.default = Loader;