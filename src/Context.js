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
   * @return {Config}
   */
  get config() {
    return this.app.config;
  }

  /**
   * The `app.logger` delegation.
   *
   * @memberof Context.prototype
   * @return {winston.Logger}
   */
  get logger() {
    return this.app.logger;
  }

  /**
   * The `app.sendMail` delegation.
   *
   * @method sendMail
   * @memberof Context.prototype
   * @return {Promise}
   *
   * @example
   *  let result = yield ctx.sendMail({from: ..., to: ...})
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
   * Get request user.
   *
   * @return {Mixed} user
   */
  get user() {
    return this.req.user;
  }

  /**
   * Set request user.
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
