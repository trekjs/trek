import Cookies from 'cookies'

export default {

  // If not a class, it's required.
  name: 'cookies',

  install (app) {
    const options = app.config.get('cookie') || {}
    const cookies = new Cookies(undefined, undefined, options)

    Reflect.defineProperty(app, 'cookies', { value: cookies })

    // context hook
    Reflect.defineProperty(cookies, 'context:created', { value: contextCreated })

    this.installed = true

    return cookies
  }

}

function contextCreated (app, context) {
  this.request = context.rawReq
  this.response = context.rawRes
  Reflect.defineProperty(context, 'cookies', { value: this })
}
