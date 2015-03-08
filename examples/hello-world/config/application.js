export default (config) => {
  config.set('views', {
    root: config.viewsPath
  }, true);

  config.set('i18n', {
    directory: config.paths.get('config/locales').path,
    locales: ['zh-CN', 'en', 'zh-tw'],
    modes: ['query', 'cookie', 'header']
  }, true);
};