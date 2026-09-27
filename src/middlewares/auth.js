const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;

        if (!token) {
            throw new Error("Invalid Token");
        }

        const decodedObj = jwt.verify(token, "DEV@Tinder$2026");

        const {_id} =  decodedObj;

        const user = await User.findById(_id);

        if (!user) {
            throw new Error("User is not defined");
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(404).send("Error: "+err.message);
    }
}

module.exports = {
    userAuth
}