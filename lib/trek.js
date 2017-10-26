const { dirname } = require('path')
const { Server } = require('http')
const Engine = require('trek-engine')
const Loader = require('./loader')
const Paths = require('./paths')
const corePlugins = require('./plugins')

// Lifecycle:
//    created
//    beforeRun
//    running
//    ran

module.exports = class Trek extends Engine {
  constructor(root = dirname(require.main.filename)) {
    super()

    this.root = root
    this.paths = new Paths(root)
    this.loader = new Loader(this)
    this.hooks = {}
    this.plugins = new Map()
  }

  // Rewrite
  initialize() {}

  // Rewrite
  async bootUp(all = true) {
    if (this.initialized) return this

    this.usePlugin(...corePlugins)

    if (all) {
      let plugins = await this.paths.get('app/plugins')
      if (plugins) {
        if (Array.isArray(plugins)) {
          // `app/plugins/*.js`
          plugins = plugins.map(p => this.loader.require(p))
        } else {
          // `app/plugins/index.js`
          plugins = this.loader.require(plugins)
        }
        if (!Array.isArray(plugins)) {
          plugins = [plugins]
        }
        this.usePlugin(...plugins)
      }
    }

    await this.callHook('created')

    this.initialized = true

    return this
  }

  // Rewrite
  invoke(ctx, onError) {
    return this.callHook('running', ctx, onError)
  }

  // Rewrite
  async run() {
    await this.callHook('beforeRun')
    if (!this.server) this.server = new Server()
    this.server.on('request', (req, res) => this.handle(req, res))
    return this.server.listen(...arguments)
  }

  usePlugin(...args) {
    for (const Plugin of args) {
      if (Plugin.install && !Plugin.installed) {
        this.plugins.set(Plugin.name, Plugin.install(this))
      }
    }
  }

  callHook(hook, ...args) {
    let h = this.hooks[hook]
    if (!Array.isArray(h)) {
      h = []
      this.hooks[hook] = h
    }
    return h
      .concat(this.findHandlersByHook(hook))
      .reduce((a, b) => a.then(() => b(this, ...args)), Promise.resolve())
  }

  findHandlersByHook(hook) {
    return Array.from(this.plugins.values())
      .filter(plugin => plugin[hook])
      .map(plugin => plugin[hook].bind(plugin))
  }
}
