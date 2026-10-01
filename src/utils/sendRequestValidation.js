const mongoose = require("mongoose");

const User = require("../models/user");

const ConnectionRequest = require("../models/connectionRequest");

const validateStatus = (status) => {
  const ALLOWED_STATUSES = ["ignored", "interested"];

  if (!ALLOWED_STATUSES.includes(status)) {
    return {
      message: "Invalid status type: " + status,
      data: null,
    };
  }

  return null;
};

const checkExistingRequest = async (status, fromUserId, toUserId) => {
  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (existingRequest) {
    return {
      message:
        status[0].toUpperCase() +
        status.slice(1) +
        " Connection Request Already Exist",
      data: existingRequest,
    };
  }

  return null;
};

const checkToUserIdExist = async (toUserId) => {
  if (!mongoose.isValidObjectId(toUserId)) {
    return {
      message: "Invalid User ID",
      data: null,
    };
  }

  const user = await User.findById(toUserId);

  if (!user) {
    return {
      message: "User not found",
      data: null,
    };
  }

  return null;
};

const validateSendRequest = async (req) => {
  const status = req.params.status;
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;

  //Validate Status
  const statusError = validateStatus(status);

  if (statusError) {
    return statusError;
  }

  //Check toUserIdExist
  const toUserIdError = await checkToUserIdExist(toUserId);

  if (toUserIdError) {
    return toUserIdError;
  }

  //Check Existing Request
  const existingRequestError = await checkExistingRequest(
    status,
    fromUserId,
    toUserId,
  );

  if (existingRequestError) {
    return existingRequestError;
  }

  return null;
};

module.exports = validateSendRequest;
