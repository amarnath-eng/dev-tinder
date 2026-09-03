const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Test Path Response");
});

app.use((req, res) => {
  res.send("Hello from the Server!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
