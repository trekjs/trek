# trek

Next generation full-stack JavaScript open source solution, based on [Koa.js][].

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

## Quick Start

## License

  [MIT](LICENSE)

[Koa.js]: http://koajs.com