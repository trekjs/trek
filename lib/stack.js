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

var _ = _interopRequire(require("lodash-node"));

var klm = _interopRequire(require("koa-load-middlewares"));

var defaultStack = _interopRequire(require("./defaultStack"));

module.exports = function (app) {
  let isProduction = Trek.isProduction;
  let config = app.config;
  let ms = klm();
  let stack = [];

  let stackPath = config.paths.get("config/middleware").first;

  try {
    stack = require(stackPath)(app);
  } catch (e) {
    app.logger.error(`Loading ${ chalk.red(stackPath) } failed ${ e }`);
  }

  let stackTemp = {

    logger: {
      handler: isProduction ? null : ms.logger },

    morgan: {
      handler: ms.morgan.middleware,
      options: [config.get("morgan.mode") || "tiny", config.get("morgan.stream") ? {
        stream: fs.createWriteStream(config.paths.get("log").first, {
          flags: "a"
        })
      } : null]
    },

    responseTime: {
      handler: ms.responseTime },

    xRequestId: {
      handler: ms.xRequestId,
      options: [app, { key: undefined, noHyphen: true, inject: true }] },

    staticCache: {
      handler: ms.staticCache,
      options: [config.publicPath, config.get("static")] },

    methodoverride: {
      handler: ms.methodoverride,
      options: config.get("methodoverride") },

    qs: {
      handler: ms.qs,
      options: app,
      isWrapped: true },

    bodyparser: {
      handler: ms.bodyparser },

    compress: {
      handler: ms.compress,
      options: config.get("compress") },

    conditionalGet: {
      handler: ms.conditionalGet },

    etag: {
      handler: ms.etag },

    genericSession: {
      handler: ms.genericSession,
      options: config.session },

    router: {
      handler: ms.router,
      options: app }

  };

  stack = _.sortBy(_.map(_.merge(stackTemp, defaultStack, stack), function (m, k) {
    if (!m.name) {
      m.name = k;
    }
    return m;
  }), "priority");

  stack.forEach(function (m) {
    let name = m.name;
    let handler = m.handler;
    let options = m.options;
    let isWrapped = m.isWrapped;
    let disabled = m.disabled;

    if (!disabled) {
      if (_.isFunction(handler)) {
        if (!options) {
          options = config.get(name);
        }
        options = Array.isArray(options) ? options : [options];
        if (isWrapped) {
          handler.apply(undefined, options);
        } else {
          app.use(handler.apply(undefined, options));
        }
      } else {
        app.logger.warn(`middleware:${ name } is enabled.`);
      }
    }
  });
};

//disabled: true