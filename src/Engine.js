'use strict'

/*!
 * trek - Engine
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import _ from 'lodash'
import { basename, dirname, join } from 'path'
import serveStatic from 'koa-static'
import chalk from 'chalk'
import co from 'co'
import convert from 'koa-convert'
import Koa from 'koa'
import Router from 'trek-router'
import RouteMapper from 'route-mapper'
import Config from './Config'
import Context from './Context'
import View from './View'

const METHODS = Router.METHODS

/**
 * The Trek Engine Core
 * @extends {Koa}
 */
export default class Engine extends Koa {

  /**
   * @param {String} rootPath The app root path.
   */
  constructor(rootPath) {
    super()

    this.initialized = false
    this.env = Trek.env
    if (rootPath) this.rootPath = rootPath
    this.initialize()
  }

  /**
   * @private
   */
  initialize() {
    // top-most app is mounted at /
    this.mountpath = '/'
    this.config = new Config(this.rootPath)
    this.router = new Router()
    // override context
    this.context = new Context()
    this.engines = new Map()
    this.cache = Object.create(null)
    this.state = Object.create(null)
    this.state.config = this.config
  }

  /**
   * Stores the `value` with `key` into `app.config`
   *
   * @returns {Engine} this
   */
  set(key, value) {
    this.config.set(key, value)
    return this
  }

  /**
   * Get the app prefix path
   *
   * @returns {String}
   */
  get path() {
    return this.parent ? this.parent.path + this.mountpath : ''
  }

  /**
   * Set a working `rootPath` directory for app
   *
   * @param {String} root path
   */
  set rootPath(rootPath) {
    this._rootPath = rootPath
  }

  /**
   * The app working `rootPath` directory
   *
   * @returns {String}
   */
  get rootPath() {
    return this._rootPath || (this._rootPath = dirname(require.main.filename))
  }

  /**
   * The `config.paths` delegation
   *
   * @returns {Paths} config.paths
   */
  get paths() {
    return this.config.paths
  }

  /**
   * The app `logger`
   *
   * @return {winston.Logger}
   */
  get logger() {
    return this._logger || (this._logger = Object.create(Trek.logger))
  }

  /**
   * Get all servides
   *
   * @example
   *
   *  app.services
   *  // return a `Map` object
   *  // => map
   *
   * @return {Map} services
   */
  get services() {
    return this._services || (this._services = new Map())
  }

  /**
   * Get a service by key
   *
   * @example
   *
   *  app.getService('db')
   *  // => db
   *
   * @param {String} key
   * @return {*} service
   */
  getService(key) {
    return this.services.get(key)
  }

  /**
   * Stores a service
   *
   * @example
   *
   *  app.setService('db', {})
   *
   * @param {String} key the service name
   * @param {*} service the service instance
   * @returns {void}
   */
  setService(key, value) {
    if (this.services.has(key)) {
      this.logger.warn(chalk.green(`service:${key} was registed`))
      return this
    }
    this.logger.debug(chalk.yellow(`service:${key} setting...`))
    this.services.set(key, value)
    return this
  }

  /**
   * Get route mapper.
   *
   * @return {RouteMapper} routeMapper
   */
  get routeMapper() {
    return this._routeMapper || (this._routeMapper = new RouteMapper())
  }

  use(x) {
    return super.use.call(this, convert(x))
  }

  /**
   * @private
   */
  loadRoutes() {
    this.logger.debug(`Start load the routes.`)
    const routesPath = this.paths.get('config/routes', true)
    const controllersPath = this.paths.get('app/controllers', true)
    try {
      //require(routesPath).call(this.routeMapper, this.routeMapper)
      this.routeMapper.draw(routesPath)
      this.routeMapper.routes.forEach(r => {
        const { controller, action } = r
        const path = join(controllersPath, controller) + '.js'
        const c = Trek.require(path)
        r.verb.forEach((m) => {
          let a
          if (c && (a = c[action])) {
            if (!Array.isArray(a)) a = [a]
            this.logger.debug(m, r.as, r.path, controller, action)
            this[m](r.path, convert.compose(...a))
          }
        })
      })
    } catch (e) {
      this.logger.warn(`Load the routes failed, ${chalk.red(e)}.`)
    }
  }

  /**
   * Load middleware stack
   *
   * @private
   */
  loadMiddlewareStack() {
    let stackPath = this.paths.get('config/middleware', true)
    const existed = !!stackPath
    let loaded = false
    let err
    if (existed) {
      try {
        Trek.require(stackPath)(this, this.config)
        loaded = true
      } catch (e) {
        err = e
      }
    }
    if (!loaded) {
      stackPath = stackPath || this.paths.getPattern('config/middleware')
      this.logger.warn(
        `Missing ${stackPath} or require failed, ${chalk.red(err || '')}.`)
    }
  }

  /**
   * Boot the app
   *
   * @returns {void}
   */
  *bootstrap() {
    if (this.isBooted) return
    yield this.config.load()
    yield this.loadServices()
    this.loadMiddlewareStack()
    this.loadRoutes()
    this.use((ctx, next) => {
      var [handler, params] = ctx.app.router.find(ctx.method, ctx.path)
      if (handler) {
        params.forEach((i) => {
          ctx.params[i.name] = i.value
        })
        return handler(ctx, next).then(body => {
          if (body) ctx.body = body
          return
        })
      }
      return next(ctx)
    })
    this.isBooted = true

    return this
  }

  /**
   * Register the given template engine callback `fn` * as `ext`.
   *
   * @param {String} ext
   * @param {GeneratorFunction} fn
   * @returns {Engine} this
   */
  engine(ext, fn) {
    if (!fn) {
      throw new Error('GeneratorFunction or Function required')
    }

    // get file extension
    var extension = ext[0] !== '.' ? '.' + ext : ext

    // store engine
    this.engines.set(extension, fn)

    return this
  }

  /**
   * Render `view` with the given `options`
   *
   * @example
   *  yield app.render('site', { name: 'trek' })
   *
   * @param {String} view The name of view
   * @param {Object} options
   * @param {Boolean} options.cache Boolean hinting to the engine
   *                                        it should cache
   * @param {String} options.filename Filename of the view being rendered
   * @returns {String}
   */
  *render(name, options = Object.create(null)) {
    var renderOptions = {}
    var view

    // merge app.state
    Object.assign(renderOptions, this.state)

    // merge options._state
    if (options._state) {
      Object.assign(renderOptions, options._state)
    }

    // merge options
    Object.assign(renderOptions, options)

    // set .cache unless explicitly provided
    if (renderOptions.cache == null) {
      renderOptions.cache = this.config.get('view.cache')
    }

    // primed cache
    if (renderOptions.cache) {
      view = this.cache[name]
    }

    if (!view) {
      view = new View(name, Object.create({
        defaultEngine: this.config.get('view.engine', 'html'),
        root: this.paths.get('app/views', true),
        engines: this.engines
      }))

      yield view.fetchPath()

      if (!view.path) {
        var dirs = Array.isArray(view.root) && view.root.length > 1 ?
          'directories "' + view.root.slice(0, -1).join('", "') +
            '" or "' + view.root[view.root.length - 1] + '"' :
          'directory "' + view.root + '"'
        var err = new Error(
          'Failed to lookup view "' + name + '" in views ' + dirs)
        err.view = view
        throw err
      }

      if (renderOptions.cache) {
        this.cache[name] = view
      }
    }

    // render
    return yield view.render(renderOptions)
  }

  /**
   * Load services
   * @returns {void}
   */
  *loadServices() {
    const files = this.paths.get('app/services')
    const seq = []
    let file
    for (file of files) {
      var name = basename(file, '.js').replace(/^[0-9]+-/, '')
      this.logger.debug(chalk.green(`service:${name} init...`))
      var service = Trek.require(`${this.rootPath}/${file}`)(this, this.config)
      if (service) {
        this.setService(name, service)
        if (service.promise) yield service.promise
        this.logger.debug(chalk.green(`service:${name} booted`))
      }
    }
  }

  /**
   * Serves a file
   *
   * @param {String} path
   * @param {String} file
   * @param {Object} options
   * @returns {Engine} this
   */
  serveFile(path, file, options) {
    var dir = dirname(file)
    //return this.get(path, serveStatic(dir, options))
    return this.get(path, function *(next) {
      yield serveStatic(dir, options).call(this, next)
    })
  }

  /**
   * Serves files from a directory
   *
   * @param {String} path
   * @param {String} dir
   * @param {Object} options
   * @returns {Engine} this
   */
  serveDir(path, dir, options) {
    dir = dirname(dir)
    //return this.get(path + '*', serveStatic(dir, options))
    return this.get(path + '*', function *(next) {
      yield serveStatic(dir, options).call(this, next)
    })
  }

  /**
   * Serves static files from a directory. It's an alias for `app#serveDir`
   *
   * @param {String} path
   * @param {String} dir
   * @param {Object} options
   * @returns {Engine} this
   */
  static(path, dir, options) {
    return this.serveDir(path, dir, options)
  }

  /**
   * Serves the default favicon - GET /favicon.ico
   *
   * @example
   *
   *  app.favicon('public/favicon.ico')
   *
   * @param {String} file
   * @returns {Engine} this
   */
  favicon(file) {
    return this.serveFile('/favicon.ico', file)
  }

  /**
   * Index serves index file
   *
   * @param {String} file
   * @param {Object} options
   * @returns {Engine} this
   */
  index(file, options) {
    return this.serveFile('/', file, options)
  }

  /**
   * Run the app
   *
   * @param {*} args
   * @returns {Promise}
   */
  run(...args) {
    this.logger.debug(chalk.green('booting...'))
    return co.call(this, function* () {
      yield this.bootstrap()
      // TODO: https
      if (!args[0]) args[0] = this.config.get('site.port')
      this.server = this.listen(...args)
      const address = this.server.address()
      this.logger.info(
        chalk.green('The application starting in %s on http://%s:%s'),
        Trek.env,
        address.address === '::' ? '127.0.0.1' : address.address,
        address.port
      )
    }).catch((e) => {
      this.logger.error(chalk.bold.red(`${e.stack}`))
      this.logger.error(chalk.red('boots failed.'))
    })
  }

  /**
   * Match adds a route > handler to the router for
   * multiple HTTP methods provided
   *
   * @param {String[]} methods
   * @param {String} path
   * @param {GeneratorFunction[]} handler
   * @returns {Engine} this
   */
  match(methods = [], path, ...handler) {
    methods.forEach((m) => {
      if (METHODS.includes(m)) {
        const v = m.replace('-', '')
        this[v](path, ...handler)
      }
    })
    return this
  }

  /**
   * Special-cased "all" method, applying the given route `path`,
   * middleware, and handler to _every_ HTTP method.
   *
   * @param {String} path
   * @param {GeneratorFunction[]} handler
   * @returns {Engine} this
   */
  all(path, ...handler) {
    return this.match(METHODS, path, ...handler)
  }

}

METHODS
.forEach((m) => {
  const v = m.replace('-', '')
  Engine.prototype[v] = eval(`(function (c) {
  return (function $${v}(path) {
    for (var _len = arguments.length - 1,
         handlers = Array(_len), _key = 0; _key < _len; _key++) {
      handlers[_key] = arguments[_key + 1]
    }
    handlers = c(handlers)
    this.router.add(m.toUpperCase(), path, handlers)
    return this
  });
})`)(convert.compose)
})
