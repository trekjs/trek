"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.__esModule = true;

var has = _interopRequire(require("lodash-node/modern/object/has"));

/**
 * helpers
 */

var splitKeyPath = function (keyPath) {
  let startIndex = 0;
  let keyPathArray = [];
  let len = keyPath.length;
  let i = 0;
  if (!len) return keyPathArray;
  while (i < len) {
    let char = keyPath[i];
    if (char === "." && (i === 0 || keyPath[i - 1] !== "\\")) {
      keyPathArray.push(keyPath.substring(startIndex, i));
      startIndex = i + 1;
    }
    i++;
  }
  keyPathArray.push(keyPath.substr(startIndex, len));
  return keyPathArray;
};

var valueForKeyPath = function (object, keyPath) {
  let keys = splitKeyPath(keyPath);
  for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    let key = _ref;

    object = object[key];
    if (!object) return;
  }
  return object;
};

var setValueForKeyPath = function (object, keyPath, value) {
  let keys = splitKeyPath(keyPath);
  while (keys.length > 1) {
    let key = keys.shift();
    if (!has(object, key)) object[key] = Object.create(null);
    object = object[key];
  }
  if (value) object[keys.shift()] = value;else delete object[keys.shift()];
};

var hasKeyPath = function (object, keyPath) {
  let keys = splitKeyPath(keyPath);
  for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    let key = _ref;

    if (!has(object, key)) return false;
    object = object[key];
  }
  return true;
};

exports.splitKeyPath = splitKeyPath;
exports.valueForKeyPath = valueForKeyPath;
exports.setValueForKeyPath = setValueForKeyPath;
exports.hasKeyPath = hasKeyPath;