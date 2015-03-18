/*!
 * trek/king/logger
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var chalk = _interopRequire(require("chalk"));

var winston = _interopRequire(require("winston"));

let Logger = winston.Logger;
let Console = winston.transports.Console;

let logger = new Logger({
  transports: [new Console({
    label: chalk.green("Trek"),
    prettyPrint: true,
    colorize: true,
    level: Trek.env === "production" ? "info" : "debug"
    //timestamp: true
  })]
});

module.exports = logger;