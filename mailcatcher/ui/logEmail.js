const config = require('../config');

const { logger: log } = config.mailcatcher;

module.exports = ({ email, url }) => {
  log('');
  log(`== MAILCATCHER: email caught ==`.padEnd(70, '='));
  log(`NODE_ENV: ${process.env.NODE_ENV}`);
  log(`view: ${url}`);
  log('');
  log(`to: ${email.to.value.map(v => v.address).join(', ')}`);
  log(`date: ${email.date}`);
  log('');
  log(email.html);
  log(''.padEnd(70, '='));
  log('');
};
