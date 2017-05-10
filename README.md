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

* **Modern**. ES6+, only for Node.js v6

* **Flexible**. Modular and extensible

* **Amiable**. Similar to [Express.js][] and [Koa.js][]


## Installation

```console
$ npm install trek@next --save
```


## Examples

### [Hello Trek](examples/hello-world/index.js)

The lightweight app uses with **Engine**. Likes **Koa**.

```js
import { Engine as Trek } from 'trek'

const app = new Trek()

app.use(async ({ res }, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ms}ms`)
  res.end('Hello Trek!')
})

app.run(3000)
```

### [Star Trek](examples/startrek/app.js)

The richer app, customize and expand your app.

```js
import Trek, { Router } from 'trek'

(async () => {
  // router 
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

  // app
  const app = new Trek()

  // customize paths of app
  app.paths.set('app', { single: true })
  app.paths.set('app/plugins', { glob: 'app/plugins/index.js', single: true })
  app.paths.set('app/controllers', { glob: 'app/controllers/*.js' })

  // autoload plugins
  await app.bootUp()

  // middleware
  app.use(async ({ req, res }, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ms}ms`)
  })

  // work with router
  app.use(async ({ req, res }, next) => {
    const route = router.find(req.method, req.path)
    if (route) {
      const [handler] = route
      if (handler !== undefined) {
        return await handler({ req, res })
      }
    }
    await next()
  })

  app.use(async ({ res }) => {
    res.status = 404
    res.end()
  })

  // start
  await app.run(3000)
})().catch(console.error)
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
