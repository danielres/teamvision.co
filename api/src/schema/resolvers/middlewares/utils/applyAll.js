import { compose } from 'lodash/fp';

export default (...middlewares) => ({ Query, Mutation, ...rest }) => {
  const applyAllTo = obj =>
    Object.entries(obj).reduce((acc, [k, v]) => {
      return { ...acc, [k]: compose(middlewares)(v) };
    }, {});

  return {
    Query: applyAllTo(Query),
    Mutation: applyAllTo(Mutation),
    ...rest,
  };
};
