'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cookies = require('cookies');

var _cookies2 = _interopRequireDefault(_cookies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  // If not a class, it's required.
  name: 'cookies',

  options: {},

  install(app) {
    this.options = Object.assign({}, app.config.get('cookie') || {}, this.options);

    this.installed = true;

    return this;
  },

  // context hook
  'context:created'(app, context) {
    const cookies = new _cookies2.default(context.rawReq, context.rawRes, this.options);
    Reflect.defineProperty(context, 'cookies', { value: cookies });
  }

};