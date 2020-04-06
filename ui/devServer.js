import express from "express";
import proxy from "http-proxy-middleware";
import Bundler from "parcel-bundler";

const config = {
  devServerPort: process.env.UI_DEV_SERVER_PORT,
  graphqlUri: process.env.GRAPHQL_URI
};

const bundler = new Bundler("src/index.html", {
  cache: true,
  cacheDir: `.cache/${process.env.NODE_ENV}`,
  autoInstall: false
});

const app = express();

app.use(
  "/graphql",
  proxy({
    target: config.graphqlUri,
    ws: true,
    pathRewrite: {
      "^/graphql": "/"
    }
  })
);

app.use(bundler.middleware());

app.listen(config.devServerPort, () => {
  console.log(`[UI] devServer: http://localhost:${config.devServerPort}`);
});
