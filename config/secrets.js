module.exports = {

  development: {
    secretKeyBase: '836fa3665997a860728bcb9e9a1e704d427cfc920e79d847d79c8a9a907b9e965defa4154b2b86bdec6930adbe33f21364523a6f6ce363865724549fdfc08553'
  },

  test: {
    secretKeyBase: '5a37811464e7d378488b0f073e2193b093682e4e21f5d6f3ae0a4e1781e61a351fdc878a843424e81c73fb484a40d23f92c8dafac4870e74ede6e5e174423010'
  },

  production: {
    secretKeyBase: process.env.SECRET_KEY_BASE,
    namespace: 'myAppProduction'
  }

};
