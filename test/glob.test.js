import co from 'co';
import glob from 'glob';
import thenify from 'thenify';

describe('thenify glob', () => {
  it("glob search `babel.js`", () => {
    return co(function *() {
      process.chdir(__dirname);
      let a = yield thenify(glob)('babel.js');
      a.should.eql(['babel.js']);
    });
  });
});
