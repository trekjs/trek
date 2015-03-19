/*!
 * trek - lib/king/bcrypt
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import thenifyAll from 'thenify-all';
import bcrypt from 'bcrypt';

thenifyAll(bcrypt, exports, [
  'genSalt',
  'compare',
  'hash'
]);
