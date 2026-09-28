const express = require("express");

const requestRouter = express.Router();

const {userAuth} = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const {firstName} = req.user;
  res.send(firstName + " Sent Connection Request Successfully!");
});

module.exports = requestRouter;