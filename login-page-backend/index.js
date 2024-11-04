require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt');
const userModel = require('./models/Student');

const app = express();
app.use(express.json());
app.use(cors());

// Retrieve MongoDB URI and port from environment variables
const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3001;

// Connect to MongoDB using mongoose
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };

        const user = await userModel.create(userData);
        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        console.error("Error creating user:", err);
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(400).json({ message: "Failed to create user", error: err.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                res.status(200).json({ message: "Login successful", user });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
