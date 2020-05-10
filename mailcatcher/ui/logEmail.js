const config = require('../config');

const { logger: log } = config;

module.exports = ({ email, href }) => {
  log('');
  log(`== MAILCATCHER: email caught `.padEnd(70, '='));
  log(`href: ${href}`);
  log(`to: ${email.to.value.map(v => v.address).join(', ')}`);
  log(`date: ${email.date}`);
  log(`== [ ${process.env.NODE_ENV} ] `.padEnd(70, '='));
  log('');
};
