import Trek, { Router } from '../../lib/'

const app = new Trek()

const router = new Router()

router.get('/', async ({ res }) => {
  res.send(200, 'Hello, Trek!')
})

router.get('/startrek', async ({ res }) => {
  res.send(200, new Buffer('Hello, Star Trek!'))
})

router.post('/', async ({ res }) => {
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
  console.log(req.accept)
  const route = router.find(req.method, req.path)
  if (route) {
    let [handler, params] = route
    if (handler !== undefined) {
      await handler({ req, res })
    }
  }
  await next()
})

app.run(3000)
