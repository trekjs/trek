import _ from 'lodash-node';
import Context from '../lib/Context';

describe('app.context', () => {
  let app, context;
  beforeEach(() => {
    app = mockApp();
    context = new Context();
    context.app = app;
  });

  it('should return a function, ctx.getService => app.getService', () => {
    _.isFunction(context.getService).should.be.equal(true);
    app.services.set('trek', 233);
    context.getService('trek').should.be.equal(app.getService('trek'));
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
