const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");
const tokenBlacklist = new Set();
require("dotenv").config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
// MongoDB Connection
mongoose
    .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true , serverSelectionTimeoutMS: 30000, family: 4})
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => {console.error("Error connecting to MongoDB:", err);
                    console.error(err);});



// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hmisId: { type: String },
    name: { type: String },
    phone: { type: String },
    gender: { type: String },
    age: { type: Number },
    shelterId: { type: mongoose.Schema.Types.Mixed },
    createdDate: { type: Date, default: Date.now },
    lastModifiedDate: { type: Date, default: Date.now },
    dataLoadSource: { type: String },
    dataLoadAlias: { type: String },
},
{ collection: "users" });

const User = mongoose.model("User", userSchema);

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    shelterAffiliation: { type: String },
    socialMediaHandle: { type: String },
    causesOfInterest: { type: [String] },
    preferredContact: { type: String },
    createdDate: { type: Date, default: Date.now }
}, { collection: "donors" });

const Donor = mongoose.model("Donor", donorSchema);

const productRequestSchema = new mongoose.Schema({
    productUrl: { type: String, required: true },
    priority: { type: Number, required: true, min: 1, max: 10 },
    requestDate: { type: Date, required: true, default: Date.now },
    requiredByDate: { type: Date, required: true },
    imageUrl: { type: String, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
});

const ProductRequest = mongoose.model("ProductRequest", productRequestSchema);

const fetchProductImage = async (url) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        });

        const page = await browser.newPage();

        // Navigate to the URL
        await page.goto(url, { waitUntil: "load", timeout: 0 });

        // Extract the product image URL
        const imageUrl = await page.evaluate(() => {
            const imgElement = document.querySelector("img"); // Update selector as needed
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

// Updated /register route
app.post("/register", async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            hmisId,
            name,
            phone,
            gender,
            age,
            shelterId,
            dataLoadSource,
            dataLoadAlias
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            hmisId,
            name,
            phone,
            gender,
            age,
            shelterId,
            dataLoadSource,
            dataLoadAlias,
            createdDate: new Date(),
            lastModifiedDate: new Date()
        });

        await newUser.save();
        console.log("User saved:", newUser);
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});
app.post("/register-donor", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            shelterAffiliation,
            socialMediaHandle,
            causesOfInterest,
            preferredContact
        } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: "Name, email, password, and phone are required." });
        }

        const existingDonor = await Donor.findOne({ email });
        if (existingDonor) {
            return res.status(400).json({ error: "Donor with this email already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDonor = new Donor({
            name,
            email,
            phone,
            password: hashedPassword,
            shelterAffiliation,
            socialMediaHandle,
            causesOfInterest,
            preferredContact
        });

        await newDonor.save();
        console.log("Donor registered:", newDonor);
        res.status(201).json({ message: "Donor registered successfully." });
    } catch (err) {
        console.error("Error registering donor:", err);
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
// Login Route (HMIS ID + Phone)
app.post("/login-hmis", async (req, res) => {
    try {
        const { hmisId, phone } = req.body;

        if (!hmisId || !phone) {
            return res.status(400).json({ error: "HMIS ID and phone number are required." });
        }

        const user = await User.findOne({ hmisId, phone });
        if (!user) {
            return res.status(400).json({ error: "No matching user found." });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful.", token });
    } catch (err) {
        console.error("Error during HMIS login:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post("/login-donor", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const donor = await Donor.findOne({ email });
        if (!donor) {
            return res.status(400).json({ error: "Donor not found." });
        }

        const isMatch = await bcrypt.compare(password, donor.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password." });
        }

        const token = jwt.sign(
            { id: donor._id, email: donor.email, role: "donor" },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Donor login successful.", token });
    } catch (err) {
        console.error("Error during donor login:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});


// Protected Route Example
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization; // Get the Authorization header
    console.log("Authorization header:", authHeader); // Debugging log

    if (!authHeader) {
        console.log("No Authorization header provided");
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token
    console.log("Extracted token:", token); // Debugging log

    if (tokenBlacklist.has(token)) {
        console.log("Token has been invalidated");
        return res.status(403).json({ error: "Token has been invalidated. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
        console.log("Decoded token:", decoded); // Should include `id` and `username`
        req.user = decoded; // Attach the decoded payload to `req.user`
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
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

app.post("/product-request", authenticateJWT,async (req, res) => {
    console.log("Authenticated user:", req.user); // Debugging log
    console.log(req.body);
    try {
        const { productUrl, priority, requestDate, requiredByDate } = req.body;

        // Validate input
        if (!productUrl || !priority || !requiredByDate) {
            return res.status(400).json({ error: "All fields are required." });
        }
        
        // Convert requestDate and requiredByDate to UTC to prevent timezone shift
        const adjustedRequestDate = new Date(requestDate);
        adjustedRequestDate.setMinutes(adjustedRequestDate.getMinutes() - adjustedRequestDate.getTimezoneOffset());

        const adjustedRequiredByDate = new Date(requiredByDate);
        adjustedRequiredByDate.setMinutes(adjustedRequiredByDate.getMinutes() - adjustedRequiredByDate.getTimezoneOffset());
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
            userId: req.user.id,
        });

        await productRequest.save();
        res.status(201).json({ message: "Product request created successfully!", productRequest });
    } catch (error) {
        console.error("Error creating product request:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.get("/product-requests", authenticateJWT, async (req, res) => {
    try {
        const { page = 1, limit = 5, sort = "priority", filterPriority } = req.query;
        const userId = req.user.id; // Extract the user's ID from the JWT

        // Build the query object
        const query = { userId }; // Only fetch requests for the authenticated user
        if (filterPriority) {
            query.priority = parseInt(filterPriority); // Filter by priority if provided
        }

        // Calculate pagination
        const options = {
            skip: (page - 1) * limit, // Skip documents for previous pages
            limit: parseInt(limit), // Limit the number of documents per page
            sort: { [sort]: 1 }, // Sort by the specified field (ascending order)
        };

        // Fetch product requests from the database
        const productRequests = await ProductRequest.find(query, null, options);

        // Get the total count of requests (for pagination)
        const totalRequests = await ProductRequest.countDocuments(query);
        const totalPages = Math.ceil(totalRequests / limit);

        res.status(200).json({
            productRequests,
            currentPage: parseInt(page),
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching product requests:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});




app.put("/product-request/:id", authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const { priority, requiredByDate } = req.body;

        // Validate input
        if (!priority || priority < 1 || priority > 10) {
            return res.status(400).json({ error: "Priority must be a number between 1 and 10." });
        }
        if (!requiredByDate) {
            return res.status(400).json({ error: "Required-by date is required." });
        }

        // Find and update the product request
        const updatedRequest = await ProductRequest.findOneAndUpdate(
            { _id: id, userId: req.user.id }, // Ensure the user owns the request
            { priority, requiredByDate }, // Update only editable fields
            { new: true, runValidators: true } // Return the updated document and validate input
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: "Product request not found or access denied." });
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
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'],
            executablePath: process.env.NODE_ENV == "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
        });
        const page = await browser.newPage();

        await page.goto(productUrl, { waitUntil: "load", timeout: 0 });

        // Adjust selector for the product image
        const imageUrl = await page.evaluate(() => {
            const imgElement = document.querySelector("img"); // Update this selector as needed
            return imgElement ? imgElement.src : null;
        });

        await browser.close();

        if (imageUrl) {
            console.log("Product Image URL:", imageUrl);
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
