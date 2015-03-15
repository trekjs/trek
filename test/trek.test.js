import path from 'path';
import assert from 'assert';
import request from 'supertest';
import Trek from '..';

describe('Trek', () => {
  it('should be global variable', () => {
    Trek.should.be.equal(global.Trek);
  });

  it('should returns current env', () => {
    Trek.env.should.be.equal('test');
    Trek.env.should.be.equal(process.env.TREK_ENV);
  });

  it('should returns package information', () => {
    Trek.package.should.not.be.null;
    Trek.package.name.should.equal('trek');
    Trek.version.should.equal(Trek.package.version);
  });
});