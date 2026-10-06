const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

const User = require("../models/user");

userRouter.get("/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
    ]);

    res.send({ message: "Data Fetched Successfully", data: requests });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        //Connections I recieved and accepted
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        //Connection that I have sent and accpeted
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      }

      return connection.fromUserId;
    });

    res.send({ message: "Data fetched Successfully", data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { page, limit } = req.query;

    const pageNumber = Number(page) || 1;
    let limitValue = Number(limit) || 10;
    limitValue = limitValue > 50 ? 50 : limitValue;
    const skipValue = (pageNumber - 1) * limitValue;

    const connectionRequests = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
    }).select("toUserId");

    const hideUsersFromFeed = connectionRequests.map(
      (connection) => connection.toUserId,
    );

    hideUsersFromFeed.push(loggedInUser._id);

    const users = await User.find({ _id: { $nin: hideUsersFromFeed } })
      .select("firstName lastName about skills")
      .skip(skipValue)
      .limit(limitValue);

    res.send({ count: users.length, data: users });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
