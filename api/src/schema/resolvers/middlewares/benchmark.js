/* eslint-disable no-console */
export default resolver => async (parent, args, context, info) => {
  if (process.env.NODE_ENV !== 'development') return resolver(parent, args, context, info);

  const opName = info.operation.name.value;
  const label = `[benchmark] resolvers.${opName}`;
  console.time(label);
  const result = await resolver(parent, args, context, info);
  console.timeEnd(label);
  return result;
};
