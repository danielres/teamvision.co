const envalid = require("envalid");

const { str, url } = envalid;

const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({
      choices: ["development", "production", "staging", "test"],
      devDefault: "development"
    }),
    AUTH0_AUDIENCE: str({ devDefault: "5d6570d7dc768007476ad381" }),
    AUTH0_ISSUER: url({ devDefault: "https://api.uptal.me/" }),
    AUTH0_JKWS_URI: url({
      devDefault: "https://api.uptal.me/.well-known/jwks.json"
    })
  },
  { strict: true }
);

module.exports = env;
