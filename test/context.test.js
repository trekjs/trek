import _ from 'lodash-node';
import extraContext from '../lib/context';

describe('app.context', () => {
  let app, context;
  beforeEach(() => {
    app = mockApp();
    context = {
      app
    };
  });

  it('should return undefined, ctx.getService', () => {
    _.has(context, 'getService').should.be.equal(false);
  });

  describe('extra context', () => {
    beforeEach(() => {
      extraContext(context);
    });

    it('should return a function, ctx.getService => app.getService', () => {
      _.has(context, 'getService').should.be.equal(true);
      app.services.set('trek', 233);
      context.getService('trek').should.be.equal(app.getService('trek'));
    });
  });

});

function mockApp() {
  return {
    services: new Map,
    getService: function(key) {
      return this.services.get(key);
    }
  };
}
