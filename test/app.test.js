import path from 'path';
import assert from 'assert';
import request from 'supertest';
import Trek from '..';

describe('app', () => {
  it('should 404 without routes', (done) => {
    var app = new Trek(path.join(__dirname, 'fixtures'));

    request(app.listen())
      .get('/')
      .expect(404, done);
  });
});