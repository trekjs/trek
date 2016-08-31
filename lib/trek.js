import { dirname } from 'path'
import { Server } from 'http'
import onFinished from 'on-finished'
import Engine from './engine'
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
    this.hooks = Object.create(null)
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
  async run () {
    await this.callHook('beforeRun')

    const server = new Server((req, res) => {
      onFinished(res, err => {
        // handle err
        if (err) {
          console.log(err)
        }
      })

      this.callHook('running', req, res)
    })

    return await server.listen(...arguments)
  }

  usePlugin (...args) {
    for (const Plugin of args) {
      if (Plugin.install && !Plugin.installed) {
        const plugin = Plugin.install(this)
        this.plugins.set(Plugin.name, plugin)
      }
    }
  }

  async callHook (hook, ...args) {
    let handlers = this.hooks[hook] || []

    handlers = handlers.concat(this.findHandlersByHook(hook))
    for (const handle of handlers) {
      await handle(this, ...args) // eslint-disable-line babel/no-await-in-loop
    }
  }

  findHandlersByHook (hook) {
    return Array.from(this.plugins.values())
      .filter(plugin => plugin[hook])
      .map(plugin => plugin[hook].bind(plugin))
  }

}
