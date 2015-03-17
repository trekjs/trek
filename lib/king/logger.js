"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var chalk = _interopRequire(require("chalk"));

var winston = _interopRequire(require("winston"));

var logger = new winston.Logger({
  transports: [new winston.transports.Console({
    label: chalk.green("Trek"),
    prettyPrint: true,
    colorize: true,
    level: Trek.env === "production" ? "info" : "debug"
    //timestamp: true
  })]
});

module.exports = logger;