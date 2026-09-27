const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const { signupValidation, loginValidation } = require("./utils/validation");
const {userAuth} = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

//SignUp 
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    //Validation
    loginValidation(req);

    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const token = jwt.sign({_id: user._id}, "DEV@Tinder$2026", {expiresIn: "1d"});

    res.cookie("token", token);
    res.send("Logged In successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Get Profile
app.get("/profile", userAuth, async (req, res) => {

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

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  console.log("Sending Connection Request");

  res.send("Connection Request Sent Successfully!");
})

connectDB()
  .then(() => {
    console.log("Database Connection Established...");

    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => console.error("Database Cannot be Connected!!\n", err));
