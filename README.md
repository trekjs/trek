<div align="center">

<p><a href="https://camo.githubusercontent.com/16aa0232aa5d0e57a0632d37d11a1ba7c814f364/687474703a2f2f7472656b6a732e636f6d2f696d616765732f7472656b2d6c6f676f2e737667" target="_blank"><img src="https://camo.githubusercontent.com/16aa0232aa5d0e57a0632d37d11a1ba7c814f364/687474703a2f2f7472656b6a732e636f6d2f696d616765732f7472656b2d6c6f676f2e737667" alt="Trek" data-canonical-src="http://trekjs.com/images/trek-logo.svg" style="max-width:100%"></a></p>

<h1><a id="user-content-trek" class="anchor" href="#trek" aria-hidden="true"><span class="octicon octicon-link"></span></a>Trek.js</h1>

<p>Fast Async Web Framework For Modern Node.js</p>

<p>
  <a href="https://travis-ci.org/trekjs/trek"><img src="https://img.shields.io/travis/trekjs/trek.svg" alt="Build status"></a>
  <a href="https://codecov.io/gh/trekjs/trek"><img src="https://codecov.io/gh/trekjs/trek/branch/master/graph/badge.svg" alt="Codecov"></a>
  <a href="https://npmjs.org/package/trek"><img src="https://img.shields.io/npm/v/trek.svg" alt="NPM version"></a>
  <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="XO code style"></a>
  <a href="https://www.npmjs.com/package/trek"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"></a>
</p>

</div>


## Features

* **Elegant**. Use `async` and `await` for asynchronous programs

* **Fast**. High performance [middleware][] and [router][]

* **Modern**. ES6+, only for Node.js v8+

* **Flexible**. Modular and extensible

* **Amiable**. Similar to [Express.js][] and [Koa.js][]


## Installation

```console
$ npm install trek --save
```


## Examples

### [Hello Trek](examples/hello-world/index.js)

The lightweight app uses with **Engine**. Likes **Koa**.

```js
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
```

### [Star Trek](examples/startrek/app.js)

The richer app, customize and expand your app.

```js
const Trek = require('../../lib')

async function launch() {
  const app = new Trek()

  app.paths.set('app', { single: true })
  app.paths.set('app/plugins', { glob: 'app/plugins/index.js', single: true })
  app.paths.set('app/controllers', { glob: 'app/controllers/*.js' })

  await app.bootUp()

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
    // Something else return 404
    ctx.cookies.set('name', null)
    ctx.res.send(404)
  })

  app.on('error', err => {
    app.logger.error(err)
  })

  await app.run(3000)
}

launch().catch(console.error)
```


---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)


[trek]: https://trekjs.com/
[express.js]: http://expressjs.com
[koa.js]:  http://koajs.com
[middleware]: https://github.com/trekjs/middleware
[router]: https://github.com/trekjs/router
