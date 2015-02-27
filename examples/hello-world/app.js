import from '../../src/';
import { Application } from '../../src/application';

var myApp = new Application;
/*
myApp.routes.routes.forEach((r) => {
  r.via.forEach((m) => {
    let controller = r.controller;
    let action = r.action;
    let c = require(__dirname + '/controllers/' + controller + '.js');
    let a;
    if (c && (a = c[action])) {
      if (!Array.isArray(a)) {
        a = [a];
      }
      myApp.app[m](r.path, ...a);
    };
  });
});
*/
console.log(myApp.root)

myApp.app.get('/', function* () {
  this.body = 'Star Trek!';
});
myApp.run({ port: 3333 });