const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./config/database");
const User = require("./models/user");
const { signupValidation, loginValidation } = require("./utils/validation");

const app = express();

app.use(express.json());

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

    res.send("Logged In successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Get User by EmailId
app.post("/user", async (req, res) => {
  try {
    const users = await User.findOne();

    if (!users || users.length === 0) {
      res.status(404).send("User is not defined");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.error("Something went wrong: ", err.message);
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//Get Feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//Delete a User
app.delete("/user", async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete({ _id: req.body.userId });
    const user = await User.findByIdAndDelete(req.body.userId);
    if (!user) {
      res.status(404).send("User is not defined");
    } else {
      res.send("User Delete Successfully");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//Update a User
app.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  const ALLOWED_UPDATES = ["photoUrl", "about", "age", "skills"];

  const isUpdateAllowed = Object.keys(data).every((k) =>
    ALLOWED_UPDATES.includes(k),
  );

  if (!isUpdateAllowed) {
    return res.status(400).send("Update not allowed!");
  }

  if (data?.skills?.length > 10) {
    return res.status(400).send("Skills can't be more than 10");
  }

  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      res.send("User is not defined");
    } else {
      res.send("User Updated Successfully!");
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection Established...");

    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => console.error("Database Cannot be Connected!!\n", err));
