import Cookies from 'cookies'

export default {

  // If not a class, it's required.
  name: 'cookies',

  options: {},

  install (app) {
    this.options = Object.assign({}, app.config.get('cookie') || {}, this.options)

    this.installed = true

    return this
  },

  // context hook
  'context:created' (app, context) {
    const cookies = new Cookies(context.rawReq, context.rawRes, this.options)
    Reflect.defineProperty(context, 'cookies', { value: cookies })
  }

}
