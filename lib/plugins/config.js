import get from 'lodash.get'
import has from 'lodash.has'
import set from 'lodash.set'

export default class Config {

  static install (app) {
    app.paths.set('config', { single: true })
    app.paths.set('config/defaults.js', { single: true })
    app.paths.set('config/local.js', { single: true })

    const config = new Config(app)

    Reflect.defineProperty(app, 'config', { value: config })

    return config
  }

  constructor (app) {
    this.app = app
    this.store = Object.create(null)
    this.set('subdomain offset', 2)
    this.set('trust proxy', false)
  }

  // hook: created
  async created (app) {
    app.paths.set('config/env.js', { single: true, glob: `config/${app.env.current}.js` })

    const configs = (await Promise.all([
      'config/defaults.js',
      'config/env.js',
      'config/local.js'
    ].map(path => app.paths.get(path))))

    configs
      .filter(path => path !== undefined)
      .forEach(config => Object.assign(this.store, app.loader.require(config)))
  }

  get (key, defaultValue) {
    return get(this.store, key, defaultValue)
  }

  has (key) {
    return has(this.store, key)
  }

  set (key, value) {
    return set(this.store, key, value)
  }

}
