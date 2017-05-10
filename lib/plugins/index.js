const env = require('./env')
const config = require('./config')
const logger = require('./logger')
const middleware = require('./middleware')

module.exports = [

  env,

  config,

  logger,

  middleware

]
