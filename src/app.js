const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error Saving the User: " + err.message);
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
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
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
