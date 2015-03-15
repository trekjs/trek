import redisStore from 'koa-redis';

// $ docker run -d -p 6379:6379 --name redis redis
// $ pwgen 7
// $ docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=ame7Mio --name postgres postgres
// $ psql -h 192.168.59.103 -p 5432 postgres postgres
// http://postgresguide.com/setup/users.html
// $ psql -h 192.168.59.103 -p 5432 trek trek #password='star trek'
// $ $(boot2docker ip)
// $ telnet $(boot2docker ip) 6379
// http://redis.io/commands/monitor

export default {

  development: {
    secretKeyBase: ''
  },

  test: {
    secretKeyBase: ''
  },

  production: {
    secretKeyBase: ''
  }

};

/*
const secrets = {
  secretKeyBase: 'star trek',
  session: {
    key: 'trek.sid',
    prefix: 'trek:sess:',
    cookie: {
      signed: false,
      httpOnly: false
    },
    // defaults to MemoryStore
    store: null
    store: redisStore({
      port: 6379,
      host: '192.168.59.103'
    })
  }
};
export default secrets;
*/