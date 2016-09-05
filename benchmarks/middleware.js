'use strict'

const Trek = require('..').default

;(async () => {

  const app = new Trek()

  await app.initialize(false)

  // number of middleware

  let n = parseInt(process.env.MW || '1', 10)
  console.log(`  ${n} middleware`)

  while (n--) {
    app.use((ctx, next) => next())
  }

  const body = new Buffer('Hello World')

  app.use(({ res }, next) => next().then(() => res.end(body)))

  await app.run(3333)
})()
  .catch(err => console.log(err))
