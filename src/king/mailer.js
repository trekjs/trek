import assign from 'lodash-node/modern/object/assign';
import chalk from 'chalk';
import Promise from 'bluebird';
import thenify from 'thenify';
import nodemailer from 'nodemailer';

/**
 * @class mailer
 */
class Mailer {

  /**
   * @param {Object} config
   */
  constructor(config = {}) {
    this._config = config;
  }

  get config() {
    return this._config;
  }

  set config(config = {}) {
    this._config = config;
  }

  get from() {
    return this.config.from || this.config.fromaddress;
  }

  // transport options
  get options() {
    return this.config.options || {};
  }

  // transport provider: mailgun, sengird, ses
  get provider() {
    return this.config.transport;
  }

  get transport() {
    return this._transport || (
      this._transport = (() => {
        let transporter;
        if (this.provider) {
          let moduleName = `nodemailer-${this.provider}-transport`;
          try {
            transporter = require(moduleName);
          } catch (e) {
            Trek.logger.error(chalk.bold.red(`Missing ${moduleName} module.`));
          }
        }
        return nodemailer.createTransport(
          transporter ? transporter(this.options) : this.options
        );
      })()
    );
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
  send(message = {}) {

    let verified = message.subject && (message.html || message.text) && message.to;

    if (!verified) {
      return Promise.reject(new Error('Email Error: Incomplete message data.'));
    }

    assign(message, {
      from: message.from || this.from,
      to: message.to || false,
      generateTextFromHTML: true,
      encoding: 'base64'
    });

    return thenify(this.transport.sendMail.bind(this.transport))(message);
  }

}

export default Mailer;