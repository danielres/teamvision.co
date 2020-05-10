import express from 'express';
import proxy from 'http-proxy-middleware';
import Bundler from 'parcel-bundler';
import config from './config';

const DEV_SERVER_PORT = config.devServer.port;
const API_URL = config.api.url;

const bundler = new Bundler('src/index.html', {
  cache: true,
  cacheDir: `.cache/${process.env.NODE_ENV}`,
  autoInstall: false,
});

const app = express();

app.use(
  '/graphql',
  proxy({
    target: API_URL,
    ws: true,
    pathRewrite: {
      '^/graphql': '/',
    },
  }),
);

app.use(bundler.middleware());

app.listen(DEV_SERVER_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[UI] devServer: http://localhost:${DEV_SERVER_PORT}`);
});
