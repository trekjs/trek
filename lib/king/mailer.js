"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var assign = _interopRequire(require("lodash-node/modern/object/assign"));

var chalk = _interopRequire(require("chalk"));

var Promise = _interopRequire(require("bluebird"));

var thenify = _interopRequire(require("thenify"));

var nodemailer = _interopRequire(require("nodemailer"));

/**
 * @class mailer
 */

let Mailer = (function () {

  /**
   * @param {Object} config
   */

  function Mailer() {
    let config = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Mailer);

    this._config = config;
  }

  /**
   * Async send mail.
   *
   *  ```
   *  mailer.send({}).then(done)
   *  ```
   *
   * @param {Object} message
   * @return {Promise}
   */

  Mailer.prototype.send = function send() {
    let message = arguments[0] === undefined ? {} : arguments[0];

    let verified = message.subject && (message.html || message.text) && message.to;

    if (!verified) {
      return Promise.reject(new Error("Email Error: Incomplete message data."));
    }

    assign(message, {
      from: message.from || this.from,
      to: message.to || false,
      generateTextFromHTML: true,
      encoding: "base64"
    });

    return thenify(this.transport.sendMail.bind(this.transport))(message);
  };

  _createClass(Mailer, {
    config: {
      get: function () {
        return this._config;
      },
      set: function () {
        let config = arguments[0] === undefined ? {} : arguments[0];

        this._config = config;
      }
    },
    from: {
      get: function () {
        return this.config.from || this.config.fromaddress;
      }
    },
    options: {

      // transport options

      get: function () {
        return this.config.options || {};
      }
    },
    provider: {

      // transport provider: mailgun, sengird, ses

      get: function () {
        return this.config.transport;
      }
    },
    transport: {
      get: function () {
        var _this = this;

        return this._transport || (this._transport = (function () {
          let transporter;
          if (_this.provider) {
            let moduleName = `nodemailer-${ _this.provider }-transport`;
            try {
              transporter = require(moduleName);
            } catch (e) {
              Trek.logger.error(chalk.bold.red(`Missing ${ moduleName } module.`));
            }
          }
          return nodemailer.createTransport(transporter ? transporter(_this.options) : _this.options);
        })());
      }
    }
  });

  return Mailer;
})();

module.exports = Mailer;