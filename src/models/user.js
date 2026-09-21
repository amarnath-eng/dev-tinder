const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
    lowercase: true,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender value is invalid");
      }
      return true;
    },
  },
  photoUrl: {
    type: String,
  },
  about: {
    type: String,
    default: "I'm Available",
  },
  skills: {
    type: [String],
  },
});

module.exports = mongoose.model("User", userSchema);
