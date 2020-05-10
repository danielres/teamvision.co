import Mailgen from 'mailgen';
import config from '../../config';
import uiResolveUrl from '../../src/utils/uiResolveUrl';
import colors from '../colors';

export default ({ expiresIn, name, tenantShortId, token }) => {
  const url = uiResolveUrl(config.ui.paths.verifyEmail, { tenantShortId, token });

  const mailGenerator = new Mailgen({
    product: {
      link: `${config.ui.url}/${tenantShortId}`,
      name: `Teamvision/${tenantShortId}`,
    },
  });

  const contents = {
    body: {
      name,
      intro: "Welcome! We're very excited to have you on board.",
      action: {
        instructions: 'To get started, please follow this link:',
        button: {
          color: colors.buttons.success,
          text: 'Confirm your account',
          link: url,
        },
      },
      outro: `Note: the above link will expire in ${expiresIn / 60} minutes.`,
    },
  };

  return {
    html: mailGenerator.generate(contents),
    text: mailGenerator.generatePlaintext(contents),
  };
};
