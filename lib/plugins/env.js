const dotenv = require('dotenv')

module.exports = class Env {
  static install(app) {
    app.paths.set('config/.env', { single: true })

    const env = new Env()

    Reflect.defineProperty(app, 'env', { value: env })
    Reflect.defineProperty(app, 'dev', { value: env.dev })

    return env
  }

  // Hook: created
  async created(app) {
    let env = await app.paths.get('config/.env', true)
    if (env) {
      dotenv.config({ path: env })
    }

    app.paths.set('config/envs', {
      single: true,
      glob: `config/envs/${this.current}`
    })
    env = await app.paths.get('config/envs', true)
    if (env) {
      dotenv.config({ path: env })
    }
  }

  get current() {
    return process.env.TREK_ENV || process.env.NODE_ENV || 'dev'
  }

  get dev() {
    return this.current.startsWith('dev')
  }

  get prod() {
    return this.current.startsWith('prod')
  }

  get test() {
    return this.current === 'test'
  }
}
