import { dirname } from 'path'
import { Server } from 'http'
import Engine from 'trek-engine'
import Loader from './loader'
import Paths from './paths'
import corePlugins from './plugins'

// lifecycle:
//    created
//    beforeRun
//    running
//    ran

export default class Trek extends Engine {

  constructor (root = dirname(require.main.filename)) {
    super()

    this.root = root
    this.paths = new Paths(root)
    this.loader = new Loader(this)
    this.hooks = {}
    this.plugins = new Map()
  }

  // rewrite
  _init () {}

  // rewrite
  async initialize (all = true) {
    if (this.initialized) return this

    this.usePlugin(...corePlugins)

    if (all) {
      let plugins = await this.paths.get('app/plugins')
      if (plugins) {
        if (Array.isArray(plugins)) { // app/plugins/*.js
          plugins = plugins.map(p => this.loader.require(p))
        } else { // app/plugins/index.js
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

  // rewrite
  invoke (ctx, onError) {
    return this.callHook('running', ctx, onError)
  }

  // rewrite
  async run () {
    await this.callHook('beforeRun')
    // return super.run(...arguments)
    const server = this.server || new Server()
    server.on('request', (req, res) => this.handle(req, res))
    return server.listen(...arguments)
  }

  usePlugin (...args) {
    for (const Plugin of args) {
      if (Plugin.install && !Plugin.installed) {
        this.plugins.set(Plugin.name, Plugin.install(this))
      }
    }
  }

  async callHook (hook, ...args) {
    return (this.hooks[hook] || [])
      .concat(this.findHandlersByHook(hook))
      .forEach(async handler => await handler(this, ...args))
  }

  findHandlersByHook (hook) {
    return Array.from(this.plugins.values())
      .filter(plugin => plugin[hook])
      .map(plugin => plugin[hook].bind(plugin))
  }

}
