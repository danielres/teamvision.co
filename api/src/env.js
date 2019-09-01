const dotenv = require("dotenv");
const envalid = require("envalid");

if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development.local" });
  dotenv.config({ path: ".env.development" });
}

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test.local" });
  dotenv.config({ path: ".env.test" });
  dotenv.config({ path: ".env.development.local" });
  dotenv.config({ path: ".env.development" });
}

const { bool, port, str, url } = envalid;

const testLocalDesc = "Must be set in .env.test.local";

const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({
      choices: ["development", "production", "staging", "test"]
    }),
    AUTH0_AUDIENCE: str(),
    AUTH0_ISSUER: url(),
    AUTH0_JKWS_URI: url(),
    AUTH0_GET_USER_INFO: bool(),
    PORT: port(),
    NEO4J_URL: url(),
    ...(process.env.NODE_ENV === "test" && {
      AUTH0_TEST_CLIENT_ID: str({ desc: testLocalDesc }),
      AUTH0_TEST_CLIENT_SECRET: str({ desc: testLocalDesc })
    })
  },
  {
    strict: true
  }
);

module.exports = env;
