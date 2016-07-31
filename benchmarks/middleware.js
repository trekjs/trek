'use strict';

const Trek = require('../dist/Trek').default;
const app = new Trek();

// number of middleware

let n = parseInt(process.env.MW || '1', 10);
console.log(`  ${n} middleware`);

while (n--) {
  app.use((ctx, next) => next());
}

const body = new Buffer('Hello World');

app.use((ctx, next) => next().then(() => ctx.res.end(body)))

app.run(3333);


