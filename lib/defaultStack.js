"use strict";

var defaultStack = {

  logger: {
    name: "logger",
    priority: 10
  },

  morgan: {
    name: "morgan",
    priority: 20
  },

  responseTime: {
    name: "responseTime",
    priority: 30
  },

  xRequestId: {
    name: "xRequestId",
    priority: 40
  },

  staticCache: {
    name: "staticCache",
    priority: 50
  },

  methodoverride: {
    name: "methodoverride",
    priority: 60
  },

  qs: {
    name: "qs",
    priority: 70
  },

  bodyparser: {
    name: "bodyparser",
    priority: 80
  },

  compress: {
    name: "compress",
    priority: 90
  },

  conditionalGet: {
    name: "conditionalGet",
    priority: 100
  },

  etag: {
    name: "etag",
    priority: 110
  },

  genericSession: {
    name: "genericSession",
    priority: 120
  },

  router: {
    name: "router",
    priority: "1024"
  }

};

module.exports = defaultStack;