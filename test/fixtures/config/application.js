export default (config) => {

  config.set('i18n', {
    directory: config.paths.get('config/locales').path,
    locales: ['en', 'zh-CN', 'zh-tw'],
    modes: ['query', 'cookie', 'header']
  }, true);

};