const bcrypt = require("bcrypt");
const validator = require("validator");
const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const { getUpdatableKeys } = require("../utils/profileValidation");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const { user } = req;

    if (user) {
      return res.send(user);
    } else {
      throw new Error("User is not defined");
    }
  } catch (err) {
    return res.status(404).send("Error: " + err.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      throw new Error("Please enter atleast one field to update");
    }

    const updatableKeys = getUpdatableKeys(req);

    const user = req.user;

    updatableKeys.forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    if (!user) {
      throw new Error("User is not defined");
    }

    console.log(user);

    res.send("Profile updated successfully!");
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

profileRouter.patch("/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const {
      currentPassword: currentPasswordByUser,
      newPassword: newPasswordByUser,
    } = req.body;

    if (currentPasswordByUser === newPasswordByUser) {
      throw new Error("Current and New Password must be different");
    }

    const isPasswordValid = await user.validatePassword(currentPasswordByUser);

    if (!isPasswordValid) {
      throw new Error("Incorrect Current Password");
    }

    if (!validator.isStrongPassword(newPasswordByUser)) {
      throw new Error("Please Enter Strong New Password");
    }

    const passwordHash = await bcrypt.hash(newPasswordByUser, 10);

    user.password = passwordHash;

    await user.save();

    res.send("Password Changed Successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
