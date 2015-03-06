"use strict";

var createTransport = require("nodemailer").createTransport;

module.exports = function (context) {
  Object.defineProperty(context, "config", {
    get: function get() {
      return this.app.config;
    },
    configurable: true
  });

  Object.defineProperty(context, "transporter", {
    get: function get() {
      var _this = this;

      return this._transporter || (function () {
        let transport = _this.config.get("mailer.transport");
        let options = _this.config.get("mailer.options");
        let transporter;
        if (transport) {
          try {
            transporter = require(`nodemailer-${ transport }-transport`);
          } catch (e) {
            console.log(`Missing nodemailer-${ transport }-transport.`);
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
    writable: true,
    configurable: true
  });
};