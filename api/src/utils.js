export const allowOnlyInEnvs = (...envs) => {
  if (!envs.includes(process.env.NODE_ENV)) throw new Error('Forbidden action in this environment');
};

export const sleep = duration => new Promise(resolve => setTimeout(resolve, duration));
