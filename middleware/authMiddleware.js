const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const secret_key = "this is a sample secret key!!!";

  if (token) {
    jwt.verify(token, secret_key, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/auth/login");
      }

      console.log(decodedToken);
      next();
    });
  } else {
    console.log("Missing jwt Token!!!");
    res.redirect("/auth/login");
  }
};

module.exports = requireAuth;
