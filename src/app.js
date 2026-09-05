const express = require("express");

const app = express();

app.get("/user", (req, res) =>
  res.send({
    firstName: "Amarnath",
    lastName: "Avs",
  }),
);

app.post("/user", (req, res) => res.send("Saved Successfully!"));

app.delete("/user", (req, res) => res.send("Deleted Successfully!"));

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
