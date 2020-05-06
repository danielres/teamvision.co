import nodemailer from 'nodemailer';
import config from '../config';

const { auth, host, port, secure } = config.mailer.smtp;
const { from } = config.mailer;
const transport = nodemailer.createTransport({ auth, host, port, secure });

export default ({ to, subject, text, html } = {}) => {
  return new Promise((resolve, reject) => {
    transport.sendMail({ from, to, subject, text, html }, (error, info, response) => {
      if (error) return reject(error);
      return resolve({ info, response });
    });
  });
};
