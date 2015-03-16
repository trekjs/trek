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
    priority: 70
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
    name: 'etag',
    priority: 110
  },

  genericSession: {
    priority: 120
  },

  router: {
    priority: '1024'
  }

};

export default defaultStack;