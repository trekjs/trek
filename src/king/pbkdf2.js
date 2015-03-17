import { pbkdf2, randomBytes } from 'mz/crypto';

/**
 * Generate a salt.
 *
 * @return {String} Detults string'length is 32.
 */
function genSalt(len = 16, encoding = 'hex') {
  return randomBytes(len).then((buf) => {
    return buf.toString(encoding);
  });
}

/**
 * Compare hash and  password + salt.
 *
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
 * @return {String} Detults string'length is 64.
 */
function hash(password, salt, iterations = 1024, keylen = 32, digest = 'sha256', encoding = 'hex') {
  return pbkdf2(password, salt, iterations, keylen, digest).then((buf) => {
    return buf.toString(encoding);
  });
}

export { genSalt, compare, hash };