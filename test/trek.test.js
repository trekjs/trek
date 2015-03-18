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

  it('should has _(lodash) object', () => {
    let _ = Trek._;
    Trek._.chunk(['a', 'b', 'c', 'd'], 2).should.be.eql([['a', 'b'], ['c', 'd']]);
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

  it('should has bcrypt object', () => {
    return co(function* () {
      let salt = yield Trek.bcrypt.genSalt(10)
      salt = '$2a$10$2MkmM/HCWZxlO3Swk3P2KO';
      let password = 'trek.js';
      let hash = yield Trek.bcrypt.hash(password, salt);
      let verified = yield Trek.bcrypt.compare(password, '$2a$10$2MkmM/HCWZxlO3Swk3P2KOxxzTr7bHoLnV5hsGCmKYFZJm8kz7LY6');
      verified.should.be.equal(true);
    });
  })

  it('should has pbkdf2 object', () => {
    return co(function* () {
      let salt = yield Trek.pbkdf2.genSalt()
      let password = 'startrek';
      salt = '3e5f6532fe209ace11b8af0824cfdbbc';
      let hash = yield Trek.pbkdf2.hash(password, salt);
      let verified = yield Trek.pbkdf2.compare('ebfaab9959e7a2d89ef6279cd795e23b3a384577f7681618f88e27fd3d442263', password, salt);
      verified.should.be.equal(true);
    });
  })
});