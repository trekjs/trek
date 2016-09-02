'use strict'

const Trek = require('..').Engine

const app = new Trek()

// number of middleware

let n = parseInt(process.env.MW || '1', 10)
console.log(`  ${n} middleware`)

while (n--) {
  app.use((ctx, next) => next())
}

const body = new Buffer('Hello World')

app.use(({ res }, next) => next().then(() => res.end(body)))

app.run(3333)
