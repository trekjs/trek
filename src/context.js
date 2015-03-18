/*!
 * trek/context
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

export default (context) => {

  Object.defineProperties(context, {

    /**
     * Delegates `app.config`.
     *
     * @property config
     * @return {Config}
     * @api public
     */
    config: {
      get() {
        return this.app.config;
      }
    },

    /**
     * Delegates `app.logger`.
     *
     * @property logger
     * @return {Object}
     * @api public
     */
    logger: {
      get() {
        return this.app.logger;
      }
    },

    /**
     * Delegates `app.sendMail`.
     *
     *  ```
     *  let result = yield ctx.sendMail({from: ..., to: ...})
     *  ```
     *
     * @method sendMail
     * @return {Promise}
     * @api public
     */
    sendMail: {
      value: function(data) {
        return this.app.sendMail(data);
      }
    },

    /**
     * Delegates `req.user`, the logined user.
     *
     * @propertya user
     * @api public
     */
    user: {

      /**
       * @getter
       * @return {Object}
       */
      get() {
          return this.req.user;
        },

      /**
       * @setter
       */
      set(user) {
        this.req.user = user;
      }
    }

  });

};