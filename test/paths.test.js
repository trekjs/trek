import assert from 'power-assert';
import '../src/Trek';
import Paths from '../src/Paths';

describe('Paths', () => {
  var paths = new Paths(__dirname + '/fixtures');

  describe('#get()', () => {
    it('should return app from `app`', () => {
      assert(paths.get('app') === 'app');
    });

    it('should return an array from `app/services`', () => {
      assert(Array.isArray(paths.get('app/services')) === true);
    });

    it('should return `config/app.toml` from `config/app`', () => {
      assert(paths.get('config/app') === 'config/app.toml');
    });

    it('should return `config/app.test.json` from `config/app.env`', () => {
      assert(paths.get('config/app.env') === 'config/app.test.json');
    });

    it('should return `config/.env.test` from `config/.env`', () => {
      assert(paths.get('config/.env') === 'config/.env.test');
    });

    it('should return `config/routes.js` from `config/routes`', () => {
      assert(paths.get('config/routes') === 'config/routes.js');
    });

  });

});
