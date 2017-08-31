const { Engine: Trek, Router } = require('../../lib')

async function launch() {
  const app = new Trek()

  const router = new Router()

  router.add('GET', '/', async ({ res }) => {
    res.send(200, 'Hello, Trek!')
  })

  router.add('GET', '/startrek', async ({ res }) => {
    res.type = 'html'
    res.send(200, Buffer.from('Hello, Star Trek!'))
  })

  router.add('POST', '/', async ({ res }) => {
    res.send(200, {
      status: 'ok',
      message: 'success'
    })
  })

  app.use(async ({ req, res }, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ms}ms`)
  })

  app.use(async ({ req, res }, next) => {
    const route = router.find(req.method, req.path)
    if (route) {
      const [handler] = route
      if (handler !== undefined) {
        await handler({ req, res })
        return
      }
    }
    await next()
  })

  app.use(async ({ res }) => {
    res.status = 404
    res.end()
  })

  app.run(3000)
}

launch().catch(console.error)
