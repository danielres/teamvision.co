import config from '../../config';

export default (path, params = {}) => {
  const resolvedPath = Object.entries(params).reduce((acc, [k, v]) => acc.replace(`:${k}`, v), path);
  return `${config.ui.url}${resolvedPath}`;
};
