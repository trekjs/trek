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
      name: "logger",
      handler: isProduction ? null : ms.logger },

    morgan: {
      name: "morgan",
      handler: ms.morgan.middleware,
      options: [config.get("middleware.morgan.mode") || "dev", config.get("middleware.morgan.stream") ? {
        stream: fs.createWriteStream(config.paths.get("log").first, {
          flags: "a"
        })
      } : null] },

    responseTime: {
      name: "responseTime",
      handler: ms.responseTime },

    xRequestId: {
      name: "xRequestId",
      handler: ms.xRequestId,
      options: [undefined, true, true] },

    staticCache: {
      name: "staticCache",
      handler: ms.staticCache,
      options: [config.publicPath, config.get("static")] },

    methodoverride: {
      name: "methodoverride",
      handler: ms.methodoverride,
      options: config.get("methodoverride") },

    qs: {
      name: "qs",
      handler: ms.qs,
      options: app,
      isWrapped: true },

    bodyparser: {
      name: "bodyparser",
      handler: ms.bodyparser },

    compress: {
      name: "compress",
      handler: ms.compress,
      options: config.get("compress") },

    conditionalGet: {
      name: "conditionalGet",
      handler: ms.conditionalGet },

    etag: {
      name: "etag",
      handler: ms.etag },

    genericSession: {
      name: "genericSession",
      handler: ms.genericSession,
      options: config.session },

    router: {
      name: "router",
      handler: ms.router,
      options: app }

  };

  stack = _.sortBy(_.merge(stackTemp, defaultStack, stack), "priority");

  stack.forEach(function (m) {
    let name = m.name;
    let handler = m.handler;
    let options = m.options;
    let isWrapped = m.isWrapped;
    let disabled = m.disabled;

    if (!disabled && _.isFunction(handler)) {
      options = Array.isArray(options) ? options : [options];
      if (isWrapped) {
        handler.apply(undefined, options);
      } else {
        app.use(handler.apply(undefined, options));
      }
      app.logger.debug(`middleware:${ name } is enabled.`);
    }
  });
};

//disable: config.get('middleware.morgan.disable')