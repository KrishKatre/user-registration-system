    const express = require("express");
    const mongoose = require("mongoose");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const cors = require("cors");
    const puppeteer = require("puppeteer");
    const bodyParser = require("body-parser");
    const tokenBlacklist = new Set();
    require("dotenv").config({path: "./key.env"});

    // Initialize Express
    const app = express();
    const PORT = 5000;

    // Middleware
    app.use(express.json());
    app.use(cors());
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
    
    const productRequestSchema = new mongoose.Schema({
        productUrl: { type: String, required: true },
        priority: { type: Number, required: true, min: 1, max: 10 },
        requestDate: { type: Date, required: true, default: Date.now },
        requiredByDate: { type: Date, required: true },
        imageUrl: { type: String, required: false },
    });
    
    const ProductRequest = mongoose.model("ProductRequest", productRequestSchema);
    
    const fetchProductImage = async (url) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
    
            // Navigate to the URL
            await page.goto(url, { waitUntil: "load", timeout: 0 });
    
            // Extract the product image URL (adjust selector based on the website)
            const imageUrl = await page.evaluate(() => {
                const imgElement = document.querySelector("img"); // Adjust selector to match product image
                return imgElement ? imgElement.src : null;
            });
    
            await browser.close();
    
            if (imageUrl) {
                console.log("Product Image URL:", imageUrl);
                return imageUrl;
            } else {
                throw new Error("Product image not found.");
            }
        } catch (error) {
            console.error("Error fetching product image:", error);
            return null;
        }
    };

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

    app.post("/product-request", async (req, res) => {
        console.log(req.body);
        try {
            const { productUrl, priority, requestDate, requiredByDate } = req.body;
    
            // Validate input
            if (!productUrl || !priority || !requiredByDate) {
                return res.status(400).json({ error: "All fields are required." });
            }
            
            const imageUrl = await fetchProductImage(productUrl);
            if (!imageUrl) {
                return res.status(404).json({ error: "Product image not found." });
            }
            // Create and save the product request
            const productRequest = new ProductRequest({
                productUrl,
                priority,
                requestDate: requestDate || new Date(),
                requiredByDate,
                imageUrl,
            });
    
            await productRequest.save();
            res.status(201).json({ message: "Product request created successfully!", productRequest });
        } catch (error) {
            console.error("Error creating product request:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    });

    app.get("/product-requests", async (req, res) => {
        try {
            const productRequests = await ProductRequest.find();
            res.status(200).json(productRequests);
        } catch (error) {
            console.error("Error fetching product requests:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    });

    app.put("/product-request/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { productUrl, priority, requiredByDate } = req.body;
    
            // Validate input
            if (!productUrl || !priority || !requiredByDate) {
                return res.status(400).json({ error: "All fields are required." });
            }
    
            // Find and update the product request
            const updatedRequest = await ProductRequest.findByIdAndUpdate(
                id,
                { productUrl, priority, requiredByDate },
                { new: true, runValidators: true } // Return the updated document and validate the data
            );
    
            if (!updatedRequest) {
                return res.status(404).json({ error: "Product request not found." });
            }
    
            res.status(200).json({ message: "Product request updated successfully!", updatedRequest });
        } catch (error) {
            console.error("Error updating product request:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    });

    app.delete("/product-request/:id", async (req, res) => {
        try {
            const { id } = req.params;
    
            // Find and delete the product request
            const deletedRequest = await ProductRequest.findByIdAndDelete(id);
    
            if (!deletedRequest) {
                return res.status(404).json({ error: "Product request not found." });
            }
    
            res.status(200).json({ message: "Product request deleted successfully!" });
        } catch (error) {
            console.error("Error deleting product request:", error);
            res.status(500).json({ error: "Internal server error." });
        }
    });

    app.post("/fetch-product-image", async (req, res) => {
        const { productUrl } = req.body;
    
        if (!productUrl) {
            return res.status(400).json({ error: "Product URL is required." });
        }
    
        try {
            // Launch Puppeteer and fetch the product image
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
    
            await page.goto(productUrl, { waitUntil: "load", timeout: 0 });
    
            // Adjust selector for the product image
            const imageUrl = await page.evaluate(() => {
                const imgElement = document.querySelector("img"); // Update this selector as needed
                return imgElement ? imgElement.src : null;
            });
    
            await browser.close();
    
            if (imageUrl) {
                return res.status(200).json({ imageUrl });
            } else {
                return res.status(404).json({ error: "Product image not found." });
            }
        } catch (error) {
            console.error("Error scraping product image:", error);
            res.status(500).json({ error: "Failed to fetch product image." });
        }
    });
    
    
    
    
    



    // Start Server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
