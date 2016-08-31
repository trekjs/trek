import Trek from '../../lib/trek'

(async () => {
  const app = new Trek()

  app.paths.set('app', { single: true })
  app.paths.set('app/plugins', { glob: 'app/plugins/index.js', single: true })
  app.paths.set('app/controllers', { glob: 'app/controllers/*.js' })

  await app.initialize()

  await app.run(3000)
})()
  .catch(err => console.error(err))
