'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _delegateProxy = require('delegate-proxy');

var _delegateProxy2 = _interopRequireDefault(_delegateProxy);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Context {

  constructor(req, res) {
    this.req = (0, _delegateProxy2.default)(new _request2.default(req), req);
    this.res = (0, _delegateProxy2.default)(new _response2.default(res), res);

    Reflect.defineProperty(this.req, 'res', { value: this.res });
    Reflect.defineProperty(this.res, 'req', { value: this.req });
  }

}
exports.default = Context;