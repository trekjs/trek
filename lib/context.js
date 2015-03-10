"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var chalk = _interopRequire(require("chalk"));

var jwt = _interopRequire(require("jsonwebtoken"));

var createTransport = require("nodemailer").createTransport;

module.exports = function (context) {
  Object.defineProperty(context, "config", {
    get: function get() {
      return this.app.config;
    },
    configurable: true
  });

  Object.defineProperty(context, "logger", {
    get: function get() {
      return this.app.logger;
    },
    configurable: true
  });

  Object.defineProperty(context, "transporter", {
    get: function get() {
      var _this = this;

      return this._transporter || (function () {
        let transport = _this.config.get("mailer.transport");
        let options = _this.config.get("mailer.options");
        let moduleName = `nodemailer-${ transport }-transport`;
        let transporter;
        if (transport) {
          try {
            transporter = require(moduleName);
          } catch (e) {
            _this.app.logger.error(chalk.bold.red(`Missing ${ moduleName }.`));
          }
        }
        return _this._transporter = createTransport(transport ? transporter(options) : options);
      })();
    },
    configurable: true
  });

  Object.defineProperty(context, "sendMail", {
    value: function sendMail(data) {
      return function (done) {
        this.transporter.sendMail(data, done);
      };
    },
    configurable: true
  });

  Object.defineProperty(context, "jwt", {
    get: function get() {
      var _this = this;

      return this._jwt || (function () {
        return _this._jwt = jwt;
      })();
    },
    configurable: true
  });
};