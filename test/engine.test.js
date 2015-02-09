import '../src/';
import {Engine} from '../src/engine';

describe('Engine', () => {
	var myEngine;
	beforeEach(() => {
		myEngine = new Engine;
	});

	describe('.config', () => {
		it('should create a `root` object', () => {
			myEngine.config.root = '.';
			//console.log(myEngine.config)
		});
	});
});


//console.log('calledFrom', myEngine.calledFrom);
//myEngine.config.root = '.';
//myEngine.config.generators().colorizeLogging = false;
//myEngine.config.generators((g) => {
//  g.orm             = 'mysql';
//  g.templateEngile  = 'jade';
//});
//myEngine.config.appGenerators.orm = 'datamapper';
////console.log(myEngine.config.generators());
//myEngine.paths.get('app/controllers').push('lib/controllers');
//console.log(myEngine.config.appGenerators);
//console.dir(myEngine.paths.get('app/controllers'));
//
//console.log(myEngine.middleware);
