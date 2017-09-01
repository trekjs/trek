const { resolve } = require('path')

module.exports = class Loader {
  constructor(app) {
    this.app = app
  }

  get root() {
    return this.app.root
  }

  require(path, root) {
    return require(resolve(root || this.root, path))
  }
}
