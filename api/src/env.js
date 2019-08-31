const envalid = require("envalid");

const { port, str, url } = envalid;

const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({
      choices: ["development", "production", "staging", "test"],
      devDefault: "development"
    }),
    AUTH0_AUDIENCE: str({ devDefault: "https://api.uptal.me" }),
    AUTH0_ISSUER: url({ devDefault: "https://uptal.eu.auth0.com/" }),
    AUTH0_JKWS_URI: url({
      devDefault: "https://uptal.eu.auth0.com/.well-known/jwks.json"
    }),
    PORT: port({ devDefault: 4000 })
  },
  { strict: true }
);

module.exports = env;
