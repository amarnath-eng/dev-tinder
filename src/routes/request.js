const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

const validateSendRequest = require("../utils/sendRequestValidation");

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const validationMessage = await validateSendRequest(req);

    if (validationMessage) {
      return res.status(400).json(validationMessage);
    }

    const { _id: fromUserId } = req.user;
    const { status, toUserId } = req.params;

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();

    res.json({
      message:
        status[0].toUpperCase() +
        status.slice(1) +
        " Connection Request Sent Successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const ALLOWED_STATUSES = ["accepted", "rejected"];

    const { status, requestId } = req.params;

    if (!ALLOWED_STATUSES.includes(status)) {
      throw new Error("Status not allowed");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: req.user._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).send({ message: "Connection Request not found" });
    }

    connectionRequest.status = status;
    await connectionRequest.save();

    res.send({
      message: `${req.user.firstName} ${status} Connection Request`,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
