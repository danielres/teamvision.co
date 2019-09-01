const supertest = require("supertest");
const server = require("../../src/server");

const getAccessToken = require("./getAccessToken");

module.exports = async query => {
  const { access_token } = await getAccessToken();

  return supertest(server)
    .post("/graphql")
    .set("Authorization", access_token)
    .set("Content-Type", "application/json")
    .send({ query })
    .expect("Content-Type", /json/)
    .expect(200)
    .then(({ body }) => body.data);
};
