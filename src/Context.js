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
   * The `app.render` delegation.
   *
   * @memberof Context.prototype
   * @return {GeneratorFunction}
   */
  get render() {
    return this._render;
  }

  set render(render) {
    this._render = render;
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
    return this._user;
  }

  /**
   * Set request user.
   *
   * @param {Mixed} user
   */
  set user(user) {
    this._user = user;
  }

}

// Sets Context's prototype to originalContext `koa/context`.
Object.setPrototypeOf(Context.prototype, originalContext);

export default Context;
