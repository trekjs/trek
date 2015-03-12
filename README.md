# trek

Next generation full-stack JavaScript open source solution, based on [Koa.js][].

  [![NPM version][npm-img]][npm-url]
  [![Build status][travis-img]][travis-url]
  [![Test coverage][coveralls-img]][coveralls-url]
  [![License][license-img]][license-url]
  [![Dependency status][david-img]][david-url]

```js
import Trek from 'trek';

var app = new Trek;

app.get('/', function* (next) {
  this.body = 'Hello World';
});

app.listen(3000);
```

## Installation

```bash
$ npm install trek
```

## Features

  * **ES6**+
  * MVC
  * dotenv
  * Loads configuration & environment variables(.env) automagically

## Quick Start

## License

  [MIT](LICENSE)

[Koa.js]: http://koajs.com

[npm-img]: https://img.shields.io/npm/v/trek.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trek
[travis-img]: https://img.shields.io/travis/trekjs/trek.svg?style=flat-square
[travis-url]: https://travis-ci.org/trekjs/trek
[coveralls-img]: https://img.shields.io/coveralls/trekjs/trek.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/trekjs/trek?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/trekjs/trek.svg?style=flat-square
[david-url]: https://david-dm.org/trekjs/trek