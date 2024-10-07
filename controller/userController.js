const collection = require("../src/mongo");

signup = async (req, res) => {
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
};

login = async (req, res) => {
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
};
module.exports = { signup, login };
