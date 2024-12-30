const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// Initialize Express
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose
    .connect("mongodb://localhost:27017/user_registration"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save the user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
