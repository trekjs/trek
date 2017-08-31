const { resolve } = require('path')
const r = require('interop-require')

module.exports = class Loader {
  constructor(app) {
    this.app = app
  }

  get root() {
    return this.app.root
  }

  require(path, root) {
    return r(resolve(root || this.root, path))
  }
}
