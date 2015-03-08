import redisStore from 'koa-redis';

// $ docker run -d -p 6379:6379 --name redis redis
// $ $(boot2docker ip)
// $ telnet $(boot2docker ip) 6379
// http://redis.io/commands/monitor

var secrets = {
  secretKeyBase: 'star trek',
  session: {
    cookie: {
      signed: false
    },
    store: redisStore({
      port: 6379,
      host: '192.168.59.103'
    })
  }
};

export default secrets;
