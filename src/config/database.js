const dns = require("dns");

dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vsamarnathofficial_db_user:mongodbjune5@namastenode.prvycpc.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
