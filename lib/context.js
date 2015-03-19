/*!
 * trek - lib/context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

module.exports = function (context) {

  /**
   * @namespace context
   */
  Object.defineProperties(context, {

    /**
     * Delegates `app.config`.
     *
     * @memberof context
     * @public
     * @return {Config}
     */
    config: {
      get: function get() {
        return this.app.config;
      }
    },

    /**
     * Delegates `app.logger`.
     *
     * @memberof context
     * @public
     * @return {Object}
     */
    logger: {
      get: function get() {
        return this.app.logger;
      }
    },

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
    sendMail: {
      value: function value(data) {
        return this.app.sendMail(data);
      }
    },

    /**
     * Delegates `req.user`, the logined user.
     *
     * @memberof context
     * @public
     */
    user: {

      /**
       * @return {Object}
       */
      get: function get() {
        return this.req.user;
      },

      set: function set(user) {
        this.req.user = user;
      }
    }

  });
};