import config from '../config';
import render from './render';
import uiResolveUrl from '../src/utils/uiResolveUrl';

export default ({ email, expiresIn, name, tenantShortId, token }) => {
  const url = uiResolveUrl(config.ui.paths.verifyEmail, { tenantShortId, token });

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
