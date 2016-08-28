import { resolve } from 'path'
import require from 'interop-require'

export default class Loader {

  constructor (app) {
    this.app = app
  }

  get root () {
    return this.app.root
  }

  load (plugins, root) {
    root = root || this.root
    for (const key of plugins) {
      const Plugin = require(resolve(root, key))
      if (Plugin.install && !Plugin.installed) {
        const plugin = Plugin.install(this.app)
        this.app.plugins.set(key, plugin)
      }
    }
  }

  require (path, root) {
    return require(resolve(root || this.root, path))
  }

}
