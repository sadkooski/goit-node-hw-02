const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const  Schema  = mongoose.Schema;

const users = new Schema({
        password: {
          type: String,
          required: [true, 'Password is required'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: {
          type: String,
          default: null,
        },
        avatarURL: 
        {
          type: String,
        },
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
});

users.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

users.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

users.methods.checkIfUserExists = async function (email) {
  const existingUser = await User.findOne({ email: email });
  return existingUser === true;
}

const User = mongoose.model("user", users);

module.exports = User;