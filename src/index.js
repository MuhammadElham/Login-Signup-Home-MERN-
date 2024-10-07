const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const router = require("../routes/router");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, "../public")));

// Serve HTML files
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../template/signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../template/login.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../template/home.html"));
});

// Use the router for form submissions
app.use("/", router);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/signups")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB connect failed!", err);
  });

// Listen on port 3000
const Port = 3000;
app.listen(Port, () => {
  console.log("Server is Running at Port = " + Port);
});
