export default (config) => {

  config.set('static', {
    buffer: true,
    maxAge: 60 * 60 * 24 * 7,
    /*
    alas: {
      '/favicon.ico': '/favicon.png'
    }
    */
  });

  config.set('morgan', {
    mode: 'combined',
    stream: true
  });

  config.set('lusca', {
    csrf: true,
    xframe: 'deny',
    xssProtection: true
  });
};