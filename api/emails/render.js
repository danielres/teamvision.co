/* eslint-disable no-console */

export default ({ content, email }) => {
  console.log('');
  console.log(`== SEND EMAIL to ${email} `.padEnd(70, '='));
  console.log(content);
  console.log(''.padEnd(70, '='));
  console.log('');
};
