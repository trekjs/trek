export default (config) => {
  // mail
  config.set('mailer', {
    transport: 'mailgun',
    options: {
      auth: {
        api_key: 'key-e28dab657c80bc556ad9f06348d855c5',
        domain: 'sandbox3eea568523f94dbe9032deef1adfe050.mailgun.org'
      }
    }
  });

  config.set('morgan', {
    mode: 'dev',
    stream: false
  });
};