const bcrypt = require("bcrypt");

const express = require("express");

const authRouter = express.Router();

const User = require("../models/user");

const { signupValidation, loginValidation } = require("../utils/validation");

//Signup 
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation
    signupValidation(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();

    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error Saving the User: " + err.message);
  }
});

//Login
authRouter.post("/login", async (req, res) => {
  try {
    //Validation
    loginValidation(req);

    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const token = await user.getJWT();

    res.cookie("token", token);
    res.send("Logged In successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;