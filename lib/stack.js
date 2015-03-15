"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

/*!
 * trek/stack
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

var fs = _interopRequire(require("fs"));

var path = _interopRequire(require("path"));

var chalk = _interopRequire(require("chalk"));

var isFunction = _interopRequire(require("lodash-node/modern/lang/isFunction"));

var klm = _interopRequire(require("koa-load-middlewares"));

module.exports = function (app) {
  let isProduction = app.env === "production";
  let config = app.config;
  let ms = klm();
  let stack = [];

  let stackPath = config.paths.get("config/middleware").first;
  try {
    stack = require(stackPath)(app);
  } catch (e) {
    app.logger.error(`Loading ${ chalk.red(stackPath) } failed ${ e.code }`);
  }

  // default before stack
  let beforeStack = [{
    handler: isProduction ? null : ms.logger
  }, {
    handler: ms.xRequestId,
    options: [undefined, true, true]
  }, {
    handler: ms.responseTime
  }, {
    handler: ms.methodoverride
  }, {
    handler: ms.qs,
    options: app,
    isWrapped: true
  }, {
    handler: ms.bodyparser
  }];

  // default after stack
  let afterStack = [{
    handler: ms.router,
    options: app
  }];

  stack = [].concat(beforeStack).concat(stack).concat(afterStack);

  stack.forEach(function (m) {
    let handler = m.handler;
    let options = m.options;
    let isWrapped = m.isWrapped;

    if (isFunction(handler)) {
      options = Array.isArray(options) ? options : [options];
      if (isWrapped) {
        handler.apply(undefined, options);
      } else {
        app.use(handler.apply(undefined, options));
      }
    }
  });
};