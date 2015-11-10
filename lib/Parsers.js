'use strict';

/*!
 * trek - Parsers
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _module = require('module');

var _module2 = _interopRequireDefault(_module);

var _toml = require('toml');

var _toml2 = _interopRequireDefault(_toml);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _hjson = require('hjson');

var _hjson2 = _interopRequireDefault(_hjson);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const js = {

  parse() {
    let content = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    let filename = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    const o = babel.transform(content);
    const m = new _module2.default(filename);
    m._compile(o.code, filename);
    return m.exports;
  }

};

const yml = {

  parse() {
    let content = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    let filename = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    return _jsYaml2.default.safeLoad(content);
  }

};

/**
 * Includes `toml`, `yml`, `json`, `js` Parsers
 * @namespace Parsers
 */
exports.default = {

  toml: _toml2.default,

  yml,

  json: _hjson2.default,

  js

};