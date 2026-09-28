const express = require("express");

const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth");

profileRouter.get("/view", userAuth, async (req, res) => {

  try {  
    const {user} = req;

    if (user) {
      return res.send(user);
    } else {
      throw new Error("User is not defined");
    }
  } catch (err) {
    return res.status(404).send("Error: "+err.message);
  }

});

module.exports = profileRouter;
