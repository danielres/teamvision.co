/* eslint-disable no-console */

export default ({ content, email }) => {
  console.log('');
  console.log(`== SEND EMAIL to ${email} == (${process.env.NODE_ENV})`.padEnd(70, '='));
  console.log(content);
  console.log(''.padEnd(70, '='));
  console.log('');
};
