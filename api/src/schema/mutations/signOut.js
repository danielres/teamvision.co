/* eslint-disable no-param-reassign */

export default (parent, args, context) => {
  context.req.session = null;
  return true;
};
