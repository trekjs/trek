export default (context) => {

  Object.defineProperties(context, {

    /**
     * Delegates `app.env`.
     *
     * @property env
     * @return {String}
     * @api public
     */
    env: {
      get() {
        return this.app.env;
      }
    },

    /**
     * Delegates `app.config`.
     *
     * @property config
     * @return {Mixed|Config}
     * @api public
     */
    config: {
      get() {
        return this.app.config;
      }
    },

    /**
     * Delegates `app.jwt`.
     *
     * @property jwt
     * @return {Object}
     * @api public
     */
    jwt: {
      get() {
        return this.app.jwt;
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
     * @return {Object}
     * @api public
     */
    sendMail: {
      value: (data) => {
        return function(done) {
          this.app.sendMail(data, done);
        }
      }
    }

  });

};