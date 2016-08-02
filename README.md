<div align="center">

<p><a href="https://camo.githubusercontent.com/16aa0232aa5d0e57a0632d37d11a1ba7c814f364/687474703a2f2f7472656b6a732e636f6d2f696d616765732f7472656b2d6c6f676f2e737667" target="_blank"><img src="https://camo.githubusercontent.com/16aa0232aa5d0e57a0632d37d11a1ba7c814f364/687474703a2f2f7472656b6a732e636f6d2f696d616765732f7472656b2d6c6f676f2e737667" alt="Trek" data-canonical-src="http://trekjs.com/images/trek-logo.svg" style="max-width:100%"></a></p>

<h1><a id="user-content-trek" class="anchor" href="#trek" aria-hidden="true"><span class="octicon octicon-link"></span></a>Trek.js</h1>

<p>Fast Async Web Framework For Modern Node.js</p>

<p>
  <a href="https://travis-ci.org/trekjs/trek"><img src="https://img.shields.io/travis/trekjs/trek.svg" alt="Build status"></a>
  <a href="https://coveralls.io/r/trekjs/trek?branch=next"><img src="https://img.shields.io/coveralls/trekjs/trek.svg" alt="Test coverage"></a>
  <a href="https://npmjs.org/package/trek"><img src="https://img.shields.io/npm/v/trek.svg" alt="NPM version"></a>
  <a href="https://www.npmjs.com/package/trek"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License"></a>
</p>

</div>


## Features

* **Easy**. Designed for usage with async and await

* **Fast**. High performance middleware and router

* **Modern**. ES6+, only for Node.js v6

* **Amiable**. Similar to Express.js and Koa.js


## Installation

```sh
$ npm install trek@next
```

## Hello Trek

```js
import Trek from 'trek'

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


## License

  [MIT](LICENSE)


[trek]: https://trekjs.com/
