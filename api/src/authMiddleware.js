const { verifyToken, getUserInfoCached } = require("./auth");
const { AuthenticationError } = require("apollo-server-express");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization || req.cookies.uptal_jwt;

  if (!token) return next();

  try {
    const decoded = await verifyToken(token);

    const expires = new Date(decoded.exp * 1000);
    res.cookie("uptal_jwt", token, { expires, httpOnly: true });
    res.cookie("uptal_authenticated", true, { expires });

    req.isAuthenticated = true;
    req.userInfo = JSON.parse(await getUserInfoCached(token));

    next();
  } catch (error) {
    console.error(error);
    next(new AuthenticationError(error.message));
  }
};
