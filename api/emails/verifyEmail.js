import config from '../config';
import render from './render';

export default ({ email, expiresIn, name, token }) => {
  const url = `${config.ui.host}/auth/verify?token=${token}`;

  render({
    email,
    content: `
      Hi ${name}!

      Thank you for signing up.
      Your account has been created.

      Please click on the following link to verify your email:

      ${url}

      Note: the above link will expire in ${expiresIn / 60} minutes.
    `,
  });
};
