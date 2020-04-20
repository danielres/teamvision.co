import render from './render';

export default ({ email, shortIds, shortId }) => {
  render({
    email,
    content: `
      There is no tenant "${shortId}" associated with your email.

      But your email is associated with these tenants:

      ${shortIds.map(i => `- ${i}`).join('\n ')}
      
      Please try again using one of the tenants from the list.
    `,
  });
};
