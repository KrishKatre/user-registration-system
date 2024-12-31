    const express = require("express");
    const mongoose = require("mongoose");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const bodyParser = require("body-parser");
    const tokenBlacklist = new Set();
    require("dotenv").config({path: "./key.env"});

    // Initialize Express
    const app = express();
    const PORT = 5000;

    // Middleware
    app.use(express.json());

    // MongoDB Connection
    mongoose
        .connect("mongodb://127.0.0.1:27017/user_registration")
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));


    // User Schema and Model
    const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    });

    const User = mongoose.model("User", userSchema);
    const SECRET_KEY = process.env.SECRET_KEY;

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
    // Login Route
    app.post("/login", async (req, res) => {
        try {
            const { usernameOrEmail, password } = req.body;

            // Input validation
            if (!usernameOrEmail || !password) {
                return res.status(400).json({ error: "All fields are required." });
            }

            // Find the user by username or email
            const user = await User.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            });

            if (!user) {
                return res.status(400).json({ error: "Invalid username or email." });
            }

            // Compare the password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid password." });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { id: user._id, username: user.username },
                SECRET_KEY,
                { expiresIn: "1h" } // Token expires in 1 hour
            );

            res.status(200).json({ message: "Login successful.", token });
        } catch (err) {
            console.error("Error during login:", err);
            res.status(500).json({ error: "Internal server error." });
        }
    });



    // Protected Route Example
    const authenticateJWT = (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        if (tokenBlacklist.has(token)) {
            return res.status(403).json({error: "Token has been invalidated. Please log in again."});
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded; // Attach user info to the request object
            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            res.status(403).json({ error: "Invalid or expired token." });
        }
    };

    app.post("/logout", authenticateJWT, (req, res) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            tokenBlacklist.add(token); // Add token to the blacklist
            return res.status(200).json({ message: "Logout successful." });
        }
        return res.status(400).json({ error: "Invalid token." });
    });

    app.get("/protected", authenticateJWT, (req, res) => {
        res.status(200).json({ message: `Hello, ${req.user.username}. Welcome to the protected route!` });
    });



    // Start Server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
