/*!
 * trek - lib/mailer
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

/**
 * @class mailer
 * @constructor
 * @param {Object} config
 */

var Mailer = (function () {
  function Mailer() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Mailer);

    this._config = config;
  }

  /**
   * Asynchronous send mail.
   *
   * @example
   *  mailer.send({}).then(done)
   *
   * @method sendMail
   * @param {Object} message
   * @property {String} message.from
   * @property {String} message.to
   * @property {String} message.subject
   * @property {String} message.html
   * @property {String} message.text
   * @return {Promise}
   */

  Mailer.prototype.send = function send() {
    var _this = this;

    var message = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var verified = message.subject && (message.html || message.text) && message.to;

    if (!verified) {
      throw new Error('Email Error: Incomplete message data.');
    }

    Object.assign(message, {
      from: message.from || this.from,
      to: message.to || false,
      generateTextFromHTML: true,
      encoding: 'base64'
    });

    return new Promise(function (resolve, reject) {
      _this.transport.sendMail(message, function (err, res) {
        err ? reject(err) : resolve(res);
      });
    });
  };

  _createClass(Mailer, [{
    key: 'config',
    get: function get() {
      return this._config;
    },
    set: function set() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._config = config;
    }
  }, {
    key: 'from',
    get: function get() {
      return this.config.from || this.config.fromaddress;
    }

    // transport options
  }, {
    key: 'options',
    get: function get() {
      return this.config.options || {};
    }

    // transport provider: mailgun, sengird, ses
  }, {
    key: 'provider',
    get: function get() {
      return this.config.transport;
    }
  }, {
    key: 'transport',
    get: function get() {
      var _this2 = this;

      return this._transport || (this._transport = (function () {
        var transporter = undefined;
        if (_this2.provider) {
          var moduleName = `nodemailer-${ _this2.provider }-transport`;
          try {
            transporter = require(moduleName);
          } catch (e) {
            Trek.logger.error(_chalk2['default'].bold.red(`Missing ${ moduleName } module.`));
          }
        }
        return _nodemailer2['default'].createTransport(transporter ? transporter(_this2.options) : _this2.options);
      })());
    }
  }]);

  return Mailer;
})();

exports['default'] = Mailer;
module.exports = exports['default'];