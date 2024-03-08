const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = {
    email: "",
    password: "",
  };

  if (err.message == "Invalid Email") {
    errors.email = "Incorect Email!";
  }

  if (err.message == "Wrong Password") {
    errors.password = "Incorect Pasword!";
  }
  if (err.code === 11000) {
    errors.email = "Email already registered!";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const secret_key = "this is a sample secret key!!!";
const maxAge = 3 * 60 * 60 * 24;

// create a jwt token...

const createToken = (id) => {
  return jwt.sign({ id }, secret_key, {
    // Accepts secconds
    expiresIn: maxAge,
  });
};

module.exports.register_get = (req, res) => {
  res.render("signup");
};
module.exports.register_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    let jwt_token = createToken(user.id);

    res.cookie("jwt", jwt_token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    let jwt_token = createToken(user.id);

    res.cookie("jwt", jwt_token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
