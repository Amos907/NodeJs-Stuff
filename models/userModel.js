const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email!"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password!"],
    minLength: [6, "Minimum password length is 6 characters!"],
  },
});

// password hashing before storage using the pre mongoose middleware
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// A static method to login the user...
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Wrong Password");
  }

  throw Error("Invalid Email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
