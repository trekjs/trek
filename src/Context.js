/*!
 * trek - Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

import originalContext from 'koa/lib/context';

/**
 * The app's context.
 *
 * @class Context
 * @extends koa/lib/context
 */
class Context {

  /**
   * The `app.config` delegation.
   *
   * @memberof Context.prototype
   * @type {Config} config
   */
  get config() {
    return this.app.config;
  }

  /**
   * The `app.logger` delegation.
   *
   * @memberof Context.prototype
   * @type {winston.Logger} logger
   */
  get logger() {
    return this.app.logger;
  }

  /**
   * The `app.sendMail` delegation.
   *
   * @example
   *  let result = yield ctx.sendMail({from: ..., to: ...})
   *
   * @method sendMail
   * @memberof Context.prototype
   * @return {Promise}
   */
  sendMail(data) {
    return this.app.sendMail(data);
  }

  /**
   * The `app.getService` delegation.
   *
   * @example
   *  let db = ctx.getService('sequelize')
   *
   * @method getService
   * @memberof Context.prototype
   * @return {Mixed} service
   */
  getService(key) {
    return this.app.getService(key);
  }

  /**
   * The `req.user` getter delegation.
   *
   * @return {Mixed} user
   */
  get user() {
    return this.req.user;
  }

  /**
   * The `req.user` setter delegation.
   *
   * @param {Mixed} user
   */
  set user(user) {
    this.req.user = user;
  }

}

// Sets Context's prototype to originalContext `koa/context`.
Object.setPrototypeOf(Context.prototype, originalContext);

export default Context;
