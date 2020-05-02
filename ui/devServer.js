import express from 'express';
import proxy from 'http-proxy-middleware';
import Bundler from 'parcel-bundler';
import config from './config';

const {
  api: { uri: graphqlTarget },
  devServer: { port },
} = config;

const bundler = new Bundler('src/index.html', {
  cache: true,
  cacheDir: `.cache/${process.env.NODE_ENV}`,
  autoInstall: false,
});

const app = express();

app.use(
  '/graphql',
  proxy({
    target: graphqlTarget,
    ws: true,
    pathRewrite: {
      '^/graphql': '/',
    },
  }),
);

app.use(bundler.middleware());

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[UI] devServer: http://localhost:${port}`);
});
