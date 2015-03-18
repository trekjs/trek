/*!
 * trek/utils
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import has from 'lodash-node/modern/object/has';

/**
 * helpers
 */

var splitKeyPath = (keyPath) => {
  let startIndex = 0;
  let keyPathArray = [];
  let len = keyPath.length;
  let i = 0;
  if (!len) return keyPathArray;
  while (i < len) {
    let char = keyPath[i];
    if (char === '.' && (i === 0 || keyPath[i - 1] !== '\\')) {
      keyPathArray.push(keyPath.substring(startIndex, i));
      startIndex = i + 1;
    }
    i++;
  }
  keyPathArray.push(keyPath.substr(startIndex, len));
  return keyPathArray;
};

var valueForKeyPath = (object, keyPath) => {
  let keys = splitKeyPath(keyPath);
  for (let key of keys) {
    object = object[key];
    if (!object) return;
  }
  return object;
};

var setValueForKeyPath = (object, keyPath, value) => {
  let keys = splitKeyPath(keyPath);
  while (keys.length > 1) {
    let key = keys.shift();
    if (!has(object, key)) object[key] = Object.create(null);
    object = object[key];
  }
  if (value)
    object[keys.shift()] = value;
  else
    delete object[keys.shift()];
};

var hasKeyPath = (object, keyPath) => {
  let keys = splitKeyPath(keyPath);
  for (let key of keys) {
    if (!has(object, key)) return false;
    object = object[key];
  }
  return true;
};

export {
  splitKeyPath,
  valueForKeyPath,
  setValueForKeyPath,
  hasKeyPath
};
