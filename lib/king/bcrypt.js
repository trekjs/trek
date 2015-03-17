"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var thenifyAll = _interopRequire(require("thenify-all"));

var bcrypt = _interopRequire(require("bcrypt"));

thenifyAll(bcrypt, module.exports, ["genSalt", "compare", "hash"]);