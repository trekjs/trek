import Trek from '../../lib'

(async () => {
  const app = new Trek()

  app.paths.set('app', { single: true })
  app.paths.set('app/plugins', { glob: 'app/plugins/index.js', single: true })
  app.paths.set('app/controllers', { glob: 'app/controllers/*.js' })

  await app.initialize()

  app.use(async ({ logger, rawReq, rawRes }, next) => {
    logger.info(rawReq)
    await next()
    logger.info(rawRes)
  })

  app.use(async ({ cookies }, next) => {
    cookies.set('name', 'trek')
    await next()
  })

  app.use(ctx => {
    if (ctx.req.path === '/') {
      return ctx.res.send(200, 'Star Trek!')
    } else if (ctx.req.path === '/error') {
      throw new Error('Nothing')
    }
    // something else return 404
    ctx.cookies.set('name', null)
    ctx.res.send(404)
  })

  app.on('error', err => {
    app.logger.error(err)
  })

  await app.run(3000)
})()
  .catch(err => console.error(err))
