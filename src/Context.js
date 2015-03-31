/*!
 * trek - lib/Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import co from 'co';
import originalContext from 'koa/lib/context';

/**
 * @class Context
 * @extends koa/lib/context
 */
class Context {

  /**
   * Delegates `app.config`.
   *
   * @public
   * @return {Config}
   */
  get config() {
    return this.app.config;
  }

  /**
   * Delegates `app.logger`.
   *
   * @public
   * @return {Object}
   */
  get logger() {
    return this.app.logger;
  }

  /**
   * Delegates `app.sendMail`.
   *
   * @example
   *  let result = yield ctx.sendMail({from: ..., to: ...})
   *
   * @method
   * @public
   * @return {Promise}
   */
  sendMail(data) {
    return this.app.sendMail(data);
  }

  /**
   * Delegates `app.getService`.
   *
   * @example
   *  let db = ctx.getService('sequelize')
   *
   * @method
   * @public
   * @return {Mixed} service
   */
  getService(key) {
    return this.app.getService(key);
  }

  /**
   * Delegates getter `req.user`, the logined user.
   *
   * @public
   */
  get user() {
    return this.req.user;
  }

  /**
   * Delegates setter `req.user`, the logined user.
   *
   * @public
   */
  set user(user) {
    this.req.user = user;
  }

}

// Sets Context's prototype to originalContext `koa/context`.
Object.setPrototypeOf(Context.prototype, originalContext);

export default Context;
