/* eslint-disable no-console */

export default error => {
  console.error('');
  console.error('== REPORT '.padEnd(70, '='));
  console.error(error);
  console.error(''.padEnd(70, '='));
  console.error('');
};
