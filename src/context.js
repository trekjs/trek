import context from 'koa/lib/context';
import { createTransport } from 'nodemailer';

Object.defineProperty(context, 'config', {
  get: function () {
    return this.app.config;
  },
  configurable: true
});

Object.defineProperty(context, 'transporter', {
  get: function () {
    return this._transporter || (() => {
      let transport = this.config.get('mailer.transport');
      let options = this.config.get('mailer.options');
      let transporter;
      if (transport) {
        try {
          transporter = require(`nodemailer-${transport}-transport`);
        } catch(e) {
          console.log(`Missing nodemailer-${transport}-transport.`);
        }
      }
      return this._transporter = createTransport(
        transport
        ? transporter(options)
        : options
      );
    })();
  },
  configurable: true
});

Object.defineProperty(context, 'sendMail', {
  value: function sendMail(data) {
    return function (done) {
      this.transporter.sendMail(data, done);
    }
  },
  writable: true,
  configurable: true
});