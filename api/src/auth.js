const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");

const env = require("./env");

const client = jwksClient({ jwksUri: env.AUTH0_JKWS_URI });

const options = {
  algorithms: ["RS256"],
  audience: env.AUTH0_AUDIENCE,
  issuer: env.AUTH0_ISSUER
};

function getKey(header, cb) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const getUser = async ({ token }) => {
  const user = new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded.email);
    });
  });
  return user;
};

module.exports = { getUser };
