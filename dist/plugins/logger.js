'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pino = require('pino');

var _pino2 = _interopRequireDefault(_pino);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  install(app) {
    const value = (0, _pino2.default)();

    Reflect.defineProperty(app, 'logger', { value });

    // context hook
    Reflect.defineProperty(value, 'context:created', { value: contextCreated });

    this.installed = true;

    return value;
  }

};


function contextCreated(app, context) {
  Reflect.defineProperty(context, 'logger', { value: this });
}