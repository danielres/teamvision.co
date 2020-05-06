import config from '../config';
import uiResolveUrl from '../src/utils/uiResolveUrl';
import sendMail from './sendMail';

export default async ({ email, expiresIn, name, tenantShortId, token }) => {
  const subject = 'Please verify your email';
  const url = uiResolveUrl(config.ui.paths.verifyEmail, { tenantShortId, token });

  const content = `
  <h1>Hi ${name}!</h1>

  <p>
    Thank you for signing up.<br/>
    Your account has been created.
  </p>

  <p>
    Please click on the following link to verify your email:
  </p>

  <p>
    <a data-testId="verifyEmail.links.verify" href="${url}">Verify my email</a>
  </p>

  <p>
    Note: the above link will expire in ${expiresIn / 60} minutes.
  </p>
`;

  const text = content;
  const html = content;

  await sendMail({ to: email, subject, text, html });
};
