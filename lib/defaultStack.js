/*!
 * trek - lib/defaultStack
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

"use strict";

var defaultStack = {

  logger: {
    priority: 10
  },

  morgan: {
    priority: 20
  },

  responseTime: {
    priority: 30
  },

  xRequestId: {
    priority: 40
  },

  staticCache: {
    priority: 50
  },

  methodoverride: {
    priority: 60
  },

  qs: {
    priority: 70,
    isWrapped: true
  },

  bodyparser: {
    priority: 80
  },

  compress: {
    priority: 90
  },

  conditionalGet: {
    priority: 100
  },

  etag: {
    name: "etag",
    priority: 110
  },

  genericSession: {
    priority: 120
  },

  router: {
    priority: 1024
  },

  //--------//

  favicon: {
    priority: 200
  },

  locale: {
    isWrapped: true,
    priority: 210
  },

  i18n: {
    priority: 220
  },

  lusca: {
    priority: 230
  },

  passport: {
    isWrapped: true,
    priority: 240
  },

  connectFlash: {
    priority: 250
  },

  swig: {
    isWrapped: true,
    priority: 260
  }

};

module.exports = defaultStack;