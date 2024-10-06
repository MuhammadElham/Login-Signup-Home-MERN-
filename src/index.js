const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // Import path module
const app = express();
const collection = require("./mongo");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To handle form data

// Serve static files (like CSS) from the public folder
app.use(express.static(path.join(__dirname, "../public")));

// Serve the signup.html form from the "template" folder
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../template/signup.html")); // Adjusted path for signup.html
});

// Serve the login.html form from the "template" folder
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../template/login.html")); // Adjusted path for login.html
});

// Serve the home.html form from the "template" folder (home page after login)
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../template/home.html"));
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/signups")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB connect failed!", err);
  });

// Handle the signup form submission
app.post("/signup", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) return res.send("Invalid data");

    // Check for existing user
    const existingName = await collection.findOne({ name: name });
    if (existingName) {
      return res.send({
        status: 400,
        message: "Name already exists",
      });
    }

    // Save the user to the database
    const newUser = new collection({ name, password });
    await newUser.save();

    // Redirect to login after successful signup
    res.redirect("/login");
  } catch (error) {
    res.status(500).send({
      message: "Error during signup",
      error,
    });
  }
});

// Handle the login form submission
app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) return res.send("Invalid login data");

    // Check if the user exists and the password matches
    const user = await collection.findOne({ name: name });
    if (!user || user.password !== password) {
      return res.status(400).send("Invalid username or password");
    }

    // Redirect to home page after successful login
    res.redirect("/home");
  } catch (error) {
    res.status(500).send({
      message: "Error during login",
      error,
    });
  }
});

// Listen on port 3000
const Port = 3000;
app.listen(Port, () => {
  console.log("Server is Running at Port = " + Port);
});
