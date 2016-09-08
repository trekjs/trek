import { dirname } from 'path'
import { Server } from 'http'
import onFinished from 'on-finished'
import Engine from 'trek-engine'
import { sendError } from 'trek-engine/lib/util'
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
  async run () {
    const DEV = this.env.dev
    const logger = this.logger
    await this.callHook('beforeRun')

    const server = new Server((req, res) => {
      const onerror = err => {
        if (err) {
          sendError(res, err, DEV)
          logger.error(err)
        }
      }
      onFinished(res, onerror)
      this.callHook('running', req, res)
        // If not finished, return 404
        .then(() => {
          if (!res.finished) {
            res.statusCode = 404
            res.end()
          }
        })
        .catch(onerror)
    })

    return await server.listen(...arguments)
  }

  usePlugin (...args) {
    for (const Plugin of args) {
      if (Plugin.install && !Plugin.installed) {
        this.plugins.set(Plugin.name, Plugin.install(this))
      }
    }
  }

  async callHook (hook, ...args) {
    (this.hooks[hook] || [])
      .concat(this.findHandlersByHook(hook))
      .reduce(async (app, handle) => {
        await handle(app, ...args)
        return app
      }, this)
  }

  findHandlersByHook (hook) {
    return Array.from(this.plugins.values())
      .filter(plugin => plugin[hook])
      .map(plugin => plugin[hook].bind(plugin))
  }

}
