const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const config = require('./config');

const { logger: log } = config;

const Mailcatcher = ({ logger = false, onEmail = () => {}, port = config.smtp.port } = {}) => {
  let emails = [];
  const host = 'localhost';

  const smtp = new SMTPServer({
    disabledCommands: ['STARTTLS'],
    logger,
    onAuth(auth, session, cb) {
      cb(null, { user: 'dummyUser' });
    },
    onData(stream, session, cb) {
      let result = '';
      stream.on('data', chunk => {
        result += chunk;
      });
      stream.on('end', () => {
        simpleParser(result, {}, (err, parsed) => {
          emails = [...emails, parsed];
          onEmail(parsed);
          cb();
        });
      });
    },
  });

  smtp.on('error', console.error); // eslint-disable-line no-console

  const close = () =>
    new Promise(resolve => {
      const caught = emails;
      emails = [];
      smtp.close(() => resolve(caught));
    });

  const empty = () => {
    const caught = emails;
    emails = [];
    return caught;
  };

  const listen = () =>
    new Promise(resolve => {
      smtp.listen(port, host, () => {
        log(`[mailcatcher] SMTP server listening on port ${port}`);
        resolve();
      });
    });

  const read = () => emails;

  return { close, empty, listen, read };
};

module.exports = { Mailcatcher };
