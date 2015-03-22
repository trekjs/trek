/*!
 * trek - lib/context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

export default (context) => {

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
      get() {
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
      get() {
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
      value: function(data) {
        return this.app.sendMail(data);
      }
    },

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
    getService: {
      value: function (key) {
        return this.app.getService(key);
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
      get() {
          return this.req.user;
        },

      set(user) {
        this.req.user = user;
      }
    }

  });

};
