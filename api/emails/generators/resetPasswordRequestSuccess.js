import Mailgen from 'mailgen';
import config from '../../config';
import uiResolveUrl from '../../src/utils/uiResolveUrl';
import colors from '../colors';

export default ({ expiresIn, tenantShortId, token }) => {
  const url = uiResolveUrl(config.ui.paths.passwordReset, { tenantShortId, token });

  const mailGenerator = new Mailgen({
    product: {
      link: `${config.ui.host}/${tenantShortId}`,
      name: `Teamvision/${tenantShortId}`,
    },
  });

  const contents = {
    body: {
      intro: 'To choose a new password, please follow this link:',
      action: {
        instructions: [`If you didn't ask for this, please ignore this message.`],
        button: {
          color: colors.buttons.primary,
          text: 'Reset password',
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
