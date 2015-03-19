/*!
 * trek - lib/king/bcrypt
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var thenifyAll = _interopRequire(require("thenify-all"));

var bcrypt = _interopRequire(require("bcrypt"));

thenifyAll(bcrypt, exports, ["genSalt", "compare", "hash"]);