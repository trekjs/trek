/*!
 * trek - lib/Context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

import originalContext from 'koa/lib/context';

/**
 * @class Context
 * @extends koa/lib/context
 */
class Context {

  /**
   * Delegates `app.config`.
   *
   * @memberof context
   * @public
   * @return {Config}
   */
  get config() {
    return this.app.config;
  }

  /**
   * Delegates `app.logger`.
   *
   * @memberof context
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
   * @memberof context
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
   * @memberof context
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
   * @memberof context
   * @public
   */
  get user() {
    return this.req.user;
  }

  /**
   * Delegates setter `req.user`, the logined user.
   *
   * @memberof context
   * @public
   */
  set user(user) {
    this.req.user = user;
  }

}

Object.setPrototypeOf(Context.prototype, originalContext);

export default Context;
