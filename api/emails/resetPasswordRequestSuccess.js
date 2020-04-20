import jwt from 'jsonwebtoken';
import config from '../config';
import render from './render';

export default ({ email, expiresIn, token }) => {
  // const { expSeconds: expiresIn, secret } = config.auth.resetPassword.jwt;
  // const token = jwt.sign({ id: userId }, secret, { expiresIn });
  // const url = `${config.ui.host}/auth/reset?token=${token}`;
  const url = `${config.ui.host}/auth/reset?token=${token}`;

  render({
    email,
    content: `
    A password reset has been requested for your email ${email}!

    If you didn't ask for this, please ignore this message.

    Please click on the following link to choose a new password:

    ${url}

    Note: the above link will expire in ${expiresIn / 60} minutes.
    `,
  });
};
