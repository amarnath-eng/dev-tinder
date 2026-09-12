const express = require("express");

const app = express();

app.get("/getUserData", (req, res) => {
  throw new Error("abcdefg");
});

app.use("/", (err, req, res, next) => {
  res.status(500).send("Something went wrong");
});

// app.use("/user", (req, res, next) => {
//   console.log("Request Handler-1");
//   next();
// });

// app.get("/userId", (req, res) => {
//   res.send("request handler-2");
// });

// app.get("/user", (req, res) => {
//   console.log("request handler-3");
//   res.send("request handler-3");
// });

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("Handler 1");
//     // res.send("Response1");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handler2");
//     res.send("response2");
//     next();
//   },
// );

app.get("/user", (req, res, next) => {
  // res.send({
  //   firstName: "Amarnath",
  //   lastName: "Avs",
  // });
  // console.log("req query: ", req.query);
  next();
});

// app.get("/user/:userId/:name/:password", (req, res) => {
//   res.send({
//     firstName: "Amarnath",
//     lastName: "Avs",
//   });

//   console.log("req query: ", req.params);
// });

// app.post("/user", (req, res) => res.send("Saved Successfully!"));

// app.delete("/user", (req, res) => res.send("Deleted Successfully!"));

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
