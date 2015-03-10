import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';

export default (context) => {
  Object.defineProperty(context, 'config', {
    get: function() {
      return this.app.config;
    },
    configurable: true
  });

  Object.defineProperty(context, 'logger', {
    get: function() {
      return this.app.logger;
    },
    configurable: true
  });

  Object.defineProperty(context, 'transporter', {
    get: function() {
      return this._transporter || (() => {
        let transport = this.config.get('mailer.transport');
        let options = this.config.get('mailer.options');
        let moduleName = `nodemailer-${transport}-transport`;
        let transporter;
        if (transport) {
          try {
            transporter = require(moduleName);
          } catch (e) {
            this.app.logger.error(chalk.bold.red(`Missing ${moduleName}.`));
          }
        }
        return this._transporter = createTransport(
          transport ? transporter(options) : options
        );
      })();
    },
    configurable: true
  });

  Object.defineProperty(context, 'sendMail', {
    value: function sendMail(data) {
      return function(done) {
        this.transporter.sendMail(data, done);
      }
    },
    configurable: true
  });

  Object.defineProperty(context, 'jwt', {
    get: function() {
      return this._jwt || (() => {
        return this._jwt = jwt;
      })();
    },
    configurable: true
  });
};