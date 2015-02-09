import path from 'path';
import '../src';
import {Application} from '../src/application';

describe('Trek', () => {
	it('should global variable', () => {
		Trek.should.equal(global.Trek);
	});

	it('should return `test` environment', () => {
		Trek.env.should.equal('test');
	});

	it('should return `development` environment', () => {
		Trek.env = 'development';
		Trek.env.should.equal('development');
	});

	it('should return `production` environment', () => {
		Trek.env = 'production';
		Trek.env.should.equal('production');
	});

	describe('Trek.app', () => {
		var app = Trek.application;
		it('should create an application', () => {
			(app instanceof Application).should.equal(true);
		});
	});

	describe('Trek.publicPath', () => {
		var app = Trek.application;
		it('should return a public path', () => {
			path.relative(__dirname, Trek.publicPath)
				.should.equal(app.paths.get('public').first);
		});
	});
});
