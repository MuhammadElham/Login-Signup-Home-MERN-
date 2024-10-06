const mongoose = require("mongoose");
const LoginSchema = new mongoose.Schema({
  name: "String",
  password: "String",
});

const collection = new mongoose.model("Collection1", LoginSchema);
module.exports = collection;
