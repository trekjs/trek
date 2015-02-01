import '../src/';
import {Application} from '../src/application';


//console.log(Application.toString());
var app = new Application();
//console.log(app.defaultMiddlewareStack);
//console.log(app.config);
//console.log(app.paths);
console.log(app.configFor('foo'));
return;
//
////app.listen(3300);
//
//console.log('Application', Application.prototype.defaultMiddlewareStack.toString());
//var defaultMiddlewareStack = app.defaultMiddlewareStack;
//console.log('defaultMiddlewareStack', defaultMiddlewareStack);
