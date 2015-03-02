export default (app, routeMapper) => {
  routeMapper.draw(m => {
    m.root('welcome#index');
    m.get('/about', { to: 'welcome#about' })
  });
};