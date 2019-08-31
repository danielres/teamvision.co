const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");
const util = require("util");
const request = util.promisify(require("request"));

const env = require("./env");

const client = jwksClient({ jwksUri: env.AUTH0_JKWS_URI });

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
};

const getUserInfo = token =>
  request({
    url: env.AUTH0_ISSUER + "userinfo",
    headers: { authorization: "Bearer " + token }
  }).then(resp => resp.body);

const verifyToken = token => {
  const options = {
    algorithms: ["RS256"],
    audience: env.AUTH0_AUDIENCE,
    issuer: env.AUTH0_ISSUER
  };

  return new Promise((resolve, reject) =>
    jwt.verify(token, getKey, options, (err, decoded) =>
      err ? reject(err) : resolve(decoded)
    )
  );
};

const verifyTokenAndGetUserInfo = async token => {
  await verifyToken(token);
  return getUserInfo(token);
};

module.exports = { verifyTokenAndGetUserInfo };
