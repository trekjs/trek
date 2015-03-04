"use strict";

var _hasOwn = Object.prototype.hasOwnProperty;
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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let key = _step.value;

      object = object[key];
      if (!object) return;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return object;
};

var setValueForKeyPath = function (object, keyPath, value) {
  let keys = splitKeyPath(keyPath);
  while (keys.length > 1) {
    let key = keys.shift();
    var _object = object;
    var _key = key;
    if (!_hasOwn.call(_object, _key)) _object[_key] = {};

    object = object[key];
  }
  if (value) object[keys.shift()] = value;else delete object[keys.shift()];
};

var hasKeyPath = function (object, keyPath) {
  let keys = splitKeyPath(keyPath);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let key = _step.value;

      if (!object.hasOwnProperty(key)) return false;
      object = object[key];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
};

exports.splitKeyPath = splitKeyPath;
exports.valueForKeyPath = valueForKeyPath;
exports.setValueForKeyPath = setValueForKeyPath;
exports.hasKeyPath = hasKeyPath;
Object.defineProperty(exports, "__esModule", {
  value: true
});