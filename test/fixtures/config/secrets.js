export default {

  development: {
    secretKeyBase: 'Hello trek.js'
  },

  test: {
    secretKeyBase: 'testing'
  },

  production: {
    secretKeyBase: `${process.env.SECRET_KEY_BASE}`
  }

};