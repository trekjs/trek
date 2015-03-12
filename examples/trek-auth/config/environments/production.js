export default (config) => {
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