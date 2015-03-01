import '../src/';
import { Application } from '../src/application';

describe('Application', () => {
	var app;
	beforeEach(() => {
		app = new Application;
	});

	it('should got MiddlewareStack', () => {
		app.defaultMiddlewareStack.constructor.name.should.equal('MiddlewareStack');
	});

});
//console.log(app.defaultMiddlewareStack);
//console.log(app.config);
//console.log(app.paths);
//console.log(app.configFor('foo'));
//console.log(app.envConfig);
//console.log(app.secrets);
//console.log(app.helpersPaths);
////app.listen(3300);
//console.log('Application', Application.prototype.defaultMiddlewareStack.toString());
//var defaultMiddlewareStack = app.defaultMiddlewareStack;
//console.log('defaultMiddlewareStack', defaultMiddlewareStack);
