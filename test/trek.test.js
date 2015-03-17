import path from 'path';
import assert from 'assert';
import request from 'supertest';
import co from 'co';
import Trek from '..';

describe('Trek', () => {
  it('should be global variable', () => {
    Trek.should.be.equal(global.Trek);
  });

  it('should returns current env', () => {
    Trek.env.should.be.equal('test');
    Trek.env.should.be.equal(process.env.TREK_ENV);
  });

  it('should be test env', () => {
    Trek.isTest.should.be.equal(true);
    Trek.isProduction.should.be.equal(false);
    Trek.isDevelopment.should.be.equal(false);
  });

  it('should returns package information', () => {
    Trek.package.should.not.be.null;
    Trek.package.name.should.equal('trek');
    Trek.version.should.equal(Trek.package.version);
  });

  it('should returns keys array', () => {
    Trek.keys.should.be.eql(['Star Trek', 'Spock', 'Trek']);
  });

  it('should has jwt object', (done) => {
    let token = Trek.jwt.sign({
      foo: 'bar'
    }, 'shhhhh');
    let data = Trek.jwt.decode(token);
    co(function*() {
        let result = yield Trek.jwt.verify(token, 'shhhhh');
        data.foo.should.be.equal(data.foo);
        let result2 = Trek.jwt.verifySync(token, 'shhhhh');
        result.foo.should.be.equal(result2.foo);
      })
      .then(done);
  });
});