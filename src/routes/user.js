const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    });

    res.send({ message: "Data Fetched Successfully", data: requests });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
