export default (...envs) => {
  if (!envs.includes(process.env.NODE_ENV)) throw new Error('Forbidden action in this environment');
};
