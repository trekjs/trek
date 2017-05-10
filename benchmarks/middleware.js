'use strict'

const Trek = require('..');

(async () => {
  const app = new Trek()

  await app.bootUp(false)

  // Number of middleware
  let n = parseInt(process.env.MW || '1', 10)
  console.log(`  ${n} middleware`)

  while (n--) {
    app.use((ctx, next) => next())
  }

  const body = Buffer.from('Hello World')

  app.use(({ res }, next) => next().then(() => res.end(body)))

  await app.run(3333)
})()
  .catch(console.error)
