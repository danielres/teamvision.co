import config from '../config';
import uiResolveUrl from '../src/utils/uiResolveUrl';
import sendMail from './sendMail';

export default async ({ email, expiresIn, tenantShortId, token }) => {
  const subject = 'Password reset';
  const url = uiResolveUrl(config.ui.paths.passwordReset, { tenantShortId, token });

  const content = `
  <h1>
    A password reset has been requested for your email ${email}!
  </h1>

  <p>
    If you didn't ask for this, please ignore this message.
  </p>

  <p>
    Please click on the following link to choose a new password:
  </p>

  <p>
  <a data-testId="ResetPassword.links.setPassword" href="${url}">Set a new password</a>
  </p>
  

  <p>
    Note: the above link will expire in ${expiresIn / 60} minutes.
  </p>
  `;

  const text = content;
  const html = content;

  await sendMail({ to: email, subject, text, html });
};
