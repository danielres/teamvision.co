import sendMail from './sendMail';

export default async ({ email, shortIds, shortId }) => {
  const subject = 'Password reset: tenant not found';

  const content = {
    email,
    content: `
      <h1>
        There is no tenant "${shortId}" associated with your email.
      </h1>

      <p>
        But your email is associated with these tenants:
      </p>

      <ul>
        ${shortIds.map(i => `<li>${i}</li>`).join('\n')}
      </ul>
      
      <p>
        Please try again using one of the tenants from the list.
      </p>
    `,
  };
  const text = content;
  const html = content;

  await sendMail({ to: email, subject, text, html });
};
