/*!
 * trek - lib/king/pbkdf2
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import { pbkdf2, randomBytes } from 'mz/crypto';

/**
 * Generate a salt.
 *
 * @method
 * @param {Number} len
 * @param {String} encoding
 * @return {String} by default 32 of slat length.
 */
function genSalt(len = 16, encoding = 'hex') {
  return randomBytes(len).then((buf) => {
    return buf.toString(encoding);
  });
}

/**
 * Compare hash and  password + salt.
 *
 * @method
 * @param {String} hashstr
 * @param {String} password
 * @param {string} salt
 * @param {Number} [iterations] 1024
 * @param {Number} [keylen] 32
 * @param {String} [digest] sha256
 * @param {String} [encoding] hex
 * @return {Boolean}
 */
function compare(hashstr, password, salt, iterations = 1024, keylen = 32, digest = 'sha256', encoding = 'hex') {
  return hash(password, salt, iterations, keylen, digest, encoding).then((data) => {
    return hashstr === data;
  });
}

/**
 * Hash a password with salt.
 *
 * @method
 * @param {String} password
 * @param {string} salt
 * @param {Number} [iterations] 1024
 * @param {Number} [keylen] 32
 * @param {String} [digest] sha256
 * @param {String} [encoding] hex
 * @return {String} by default 64 of password_hash length.
 */
function hash(password, salt, iterations = 1024, keylen = 32, digest = 'sha256', encoding = 'hex') {
  return pbkdf2(password, salt, iterations, keylen, digest).then((buf) => {
    return buf.toString(encoding);
  });
}

export { genSalt, compare, hash };
