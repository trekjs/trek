import co from 'co';
import glob from 'glob';
import thenify from 'thenify';

describe('thenify glob', () => {
  it("glob search `6to5.js`", () => {
    return co(function *() {
      process.chdir(__dirname);
      let a = yield thenify(glob)('6t*.js');
      a.should.eql(['6to5.js']);
    });
  });
});
