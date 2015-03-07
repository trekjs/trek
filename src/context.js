import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';

export default (context) => {
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
            console.log(chalk.bold.red(`Missing nodemailer-${transport}-transport.`));
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

  Object.defineProperty(context, 'jwt', {
    get: function () {
      return this._jwt || (() => {
        return this._jwt = jwt;
      })();
    },
    configurable: true
  });
};