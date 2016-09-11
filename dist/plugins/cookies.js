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

  install(app) {
    const options = app.config.get('cookie') || {};
    const cookies = new _cookies2.default(undefined, undefined, options);

    Reflect.defineProperty(app, 'cookies', { value: cookies });

    // context hook
    Reflect.defineProperty(cookies, 'context:created', { value: contextCreated });

    this.installed = true;

    return cookies;
  }

};


function contextCreated(app, context) {
  this.request = context.rawReq;
  this.response = context.rawRes;
  Reflect.defineProperty(context, 'cookies', { value: this });
}