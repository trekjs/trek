module.exports = (app) => {
  app.routes.draw(m => {
    m.root('welcome#index');
  });
};