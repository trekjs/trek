'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _module2 = require('module');

var _module3 = _interopRequireDefault(_module2);

var _toml = require('toml');

var _toml2 = _interopRequireDefault(_toml);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _babel = require('babel');

var babel = _interopRequireWildcard(_babel);

const BabelParser = {

  parse: function parse() {
    var context = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var filename = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    var o = babel.transform(context);
    var m = new _module3['default'](filename);
    m._compile(o.code, filename);
    return m.exports;
  }

};

const Parsers = {

  toml: _toml2['default'],

  json: _hjson2['default'],

  js: BabelParser

};

exports['default'] = Parsers;
module.exports = exports['default'];