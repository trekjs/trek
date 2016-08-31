export default class DB {

  static install (app) {
    const db = new DB()

    Reflect.defineProperty(app, 'db', { value: db })

    return db
  }

  constructor () {
    console.log('DB was created.')
  }

  async created () {
    console.log('Bump while the app was created.')
  }

}
