const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Mani",
    lastName: "Shankar",
    emailId: "mani@gmail.com",
    password: "password123",
  });

  try {
    await user.save();

    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error Saving the User: " + err.message);
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
