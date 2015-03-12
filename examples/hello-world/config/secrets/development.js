const secrets = {
  secretKeyBase: 'star trek',
  session: {
    key: 'trek.sid',
    prefix: 'trek:sess:',
    cookie: {
      signed: false,
      httpOnly: false
    },
    // default to MemoryStore
    store: null
  }
};

export default secrets;