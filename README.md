<div align="center">

<p><a href="https://camo.githubusercontent.com/16aa0232aa5d0e57a0632d37d11a1ba7c814f364/687474703a2f2f7472656b6a732e636f6d2f696d616765732f7472656b2d6c6f676f2e737667" target="_blank"><img src="https://camo.githubusercontent.com/16aa0232aa5d0e57a0632d37d11a1ba7c814f364/687474703a2f2f7472656b6a732e636f6d2f696d616765732f7472656b2d6c6f676f2e737667" alt="Trek" data-canonical-src="http://trekjs.com/images/trek-logo.svg" style="max-width:100%"></a></p>

<h1><a id="user-content-trek" class="anchor" href="#trek" aria-hidden="true"><span class="octicon octicon-link"></span></a>Trek.js</h1>

<p>Fast Async Web Framework for modern node</p>

<p>
  <a href="https://gitter.im/trekjs/trek?utm_source=badge&amp;utm_medium=badge&amp;utm_campaign=pr-badge&amp;utm_content=badge"><img src="https://camo.githubusercontent.com/da2edb525cde1455a622c58c0effc3a90b9a181c/68747470733a2f2f6261646765732e6769747465722e696d2f4a6f696e253230436861742e737667" alt="Gitter" data-canonical-src="https://badges.gitter.im/Join%20Chat.svg" style="max-width:100%;"></a>
  <a href="https://npmjs.org/package/trek"><img src="https://camo.githubusercontent.com/14ce7cf440a1feef0103fee4a9e5d063a20cc99a/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f7472656b2e7376673f7374796c653d666c61742d737175617265" alt="NPM version" data-canonical-src="https://img.shields.io/npm/v/trek.svg?style=flat-square" style="max-width:100%;"></a>
  <a href="https://travis-ci.org/trekjs/trek"><img src="https://camo.githubusercontent.com/f61c1ca95f810bf55a83978ddd74a2158f0c438a/68747470733a2f2f696d672e736869656c64732e696f2f7472617669732f7472656b6a732f7472656b2e7376673f7374796c653d666c61742d737175617265" alt="Build status" data-canonical-src="https://img.shields.io/travis/trekjs/trek.svg?style=flat-square" style="max-width:100%;"></a>
  <a href="https://coveralls.io/r/trekjs/trek?branch=master"><img src="https://camo.githubusercontent.com/0817c4a8a7a1e02139e0cda9c49ed4c45ce7a326/68747470733a2f2f696d672e736869656c64732e696f2f636f766572616c6c732f7472656b6a732f7472656b2e7376673f7374796c653d666c61742d737175617265" alt="Test coverage" data-canonical-src="https://img.shields.io/coveralls/trekjs/trek.svg?style=flat-square" style="max-width:100%;"></a>
  <a href="/trekjs/trek/blob/5bf473d8a4a9558ef88678a0349dcdad401cd9b9/LICENSE"><img src="https://camo.githubusercontent.com/95e854794a291423fe200ec681d09ed63f9fadd1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d677265656e2e7376673f7374796c653d666c61742d737175617265" alt="License" data-canonical-src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" style="max-width:100%;"></a>
  <a href="https://david-dm.org/trekjs/trek"><img src="https://camo.githubusercontent.com/a50e51ff8e061782eee07450c1ed92b2278baf47/68747470733a2f2f696d672e736869656c64732e696f2f64617669642f7472656b6a732f7472656b2e7376673f7374796c653d666c61742d737175617265" alt="Dependency status" data-canonical-src="https://img.shields.io/david/trekjs/trek.svg?style=flat-square" style="max-width:100%;"></a>
</p>

</div>


## Features

* **Fast**. Ultra-high performance middleware

* **Modern**. ES6+, only for node v6

* **Future**. Designed for usage with `async` and `await` (ES7)


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

[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]:https://gitter.im/trekjs/trek?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[npm-img]: https://img.shields.io/npm/v/trek.svg
[npm-url]: https://npmjs.org/package/trek
[travis-img]: https://img.shields.io/travis/trekjs/trek.svg
[travis-url]: https://travis-ci.org/trekjs/trek
[coveralls-img]: https://img.shields.io/coveralls/trekjs/trek.svg
[coveralls-url]: https://coveralls.io/r/trekjs/trek?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/trekjs/trek.svg
[david-url]: https://david-dm.org/trekjs/trek
