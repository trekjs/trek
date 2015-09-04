import co from 'co';
import assert from 'power-assert';
import '../src/Trek';
import Config from '../src/Config';

describe('Config', () => {

  var config = new Config(__dirname + '/fixtures');
  before(() => {
    return co(function *() {
      yield config.load();
    });
  });

  describe('#get()', () => {
    it('should return $PATH from env', () => {
      assert(config.get('PATH').length !== 0);
      assert(config.get('PORT') === 377);
    });

    it('should return a secret key from secrets.js', () => {
      assert(config.get('secrets.secret_key') === 'Oabah4p');
    });

  });

  describe('#set()', () => {
    it('should return new value when reseting', () => {
      assert(config.get('owner.age') === 144);
      config.set('owner.age', 233);
      assert(config.get('owner.age') === 233);
    });
  });

});

