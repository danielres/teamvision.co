import Mailgen from 'mailgen';
import config from '../../config';

export default ({ shortId, shortIds }) => {
  const mailGenerator = new Mailgen({
    product: {
      link: `${config.ui.host}`,
      name: `Teamvision`,
    },
  });

  const contents = {
    body: {
      intro: [
        `There is no tenant "${shortId}" associated with your email.`,
        `But your email is associated with these tenants`,
        `Please try again using one of the tenants from the list.`,
      ],
      outro: shortIds.map(sid => `- ${sid}`),
    },
  };

  return {
    html: mailGenerator.generate(contents),
    text: mailGenerator.generatePlaintext(contents),
  };
};
