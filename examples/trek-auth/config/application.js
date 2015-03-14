export default (config) => {

  config.set('site', {
    protocol: 'http://',
    host: config.env.HOST || '127.0.0.1',
    port: config.env.PORT || 3000
  }, true);

  config.set('views', {
    root: config.viewsPath
  }, true);

  config.set('i18n', {
    directory: config.paths.get('config/locales').path,
    locales: ['en', 'zh-CN', 'zh-tw'],
    modes: ['query', 'cookie', 'header']
  }, true);
};