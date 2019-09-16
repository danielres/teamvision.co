const env = require("./env");

const neo4j = require("neo4j-driver").v1;

const driver = neo4j.driver(
  env.NEO4J_URL,
  neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD),
  { disableLosslessIntegers: true }
);

module.exports = driver;
