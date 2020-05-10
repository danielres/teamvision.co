const nodemailer = require('nodemailer');
const config = require('../../config');

module.exports = ({
  port = config.smtp.port,
  secure = false,
  message: {
    from = 'noreply@example.com',
    to = 'user@example.com',
    subject = 'Hello world',
    text = `Hello world`,
    html = `<p>Hello world</p>`,
  } = {},
} = {}) => {
  const transport = nodemailer.createTransport({
    auth: { user: 'username', pass: 'password' },
    host: 'localhost',
    port,
    secure,
  });

  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, text, html }, (error, info, response) => {
      if (error) return reject(error);
      return resolve({ info, response });
    });
  });
};
