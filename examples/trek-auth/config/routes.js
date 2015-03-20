export default (routeMapper) => {

  routeMapper

    .controller('auth', () => {

      routeMapper
        .get('login', { action: 'login' })
        .get('logout', { action: 'logout' })
        .get('signup', { action: 'register' })

        .post('auth/local', { action: 'callback' })
        .post('auth/local/:action', { action: 'callback' })

        .get('auth/:provider', { to: 'auth#provider' })
        .get('auth/:provider/:action', { to: 'auth#callback' })

  })

};
