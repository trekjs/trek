export default (config) => {
  config.set('morgan', {
    mode: 'combined',
    stream: true
  });
};