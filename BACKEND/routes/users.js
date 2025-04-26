const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Add uuid for userID

const authMiddleware = require("../Middleware/authMiddleware"); // Import middleware
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "mykey";

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });

// User Registration Route
router.post("/add", async (req, res) => {
    try {
        let { fullName, email, password,gender,dateofBirth, phone, role } = req.body;

        // Normalize email for case-insensitive uniqueness
        email = email.toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const myEncPassword = await bcrypt.hash(password, salt);

        // Generate unique userID
        const userID = uuidv4(); // Generate UUID

        // Create a new user
        const newUser = new User({
            userID, // Add userID
            fullName: fullName.trim(), // Preserve capitalization but remove extra spaces
            email,
            password: myEncPassword,
            gender,
            dateofBirth : new Date(dateofBirth),
            phone,
            role,
            createdAt: Date.now() // Automatically generate createdAt timestamp
        });

        // Save the user to the database
        await newUser.save();

        // Send success response
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// ✅ Read All Users (Admin Only)
router.get("/", authMiddleware(["admin"]), async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// ✅ Read User Profile (Authenticated Users Only)
router.get("/profile", authMiddleware(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Fetch user by ID from JWT token

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
});

// ✅ Read a Single User by Email (Authenticated Users Only)
router.get("/:email", authMiddleware(), async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

// ✅ Update Profile (User can update only their own profile, Admin can update anyone)
router.put("/update/:id", upload.single("profilePic"),authMiddleware(), async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, password,gender,dateofBirth, phone, role } = req.body;

        // If no profile picture is uploaded, set the default based on gender
    if (req.file) {
        user.profilePic = `/uploads/${req.file.filename}`;
      } else {
        if (user.gender === "male") {
          user.profilePic = "/images/male-default.png"; // Default male image
        } else if (user.gender === "female") {
          user.profilePic = "/images/female-default.png"; // Default female image
        }
      }
  

        // Check if the logged-in user is updating their own profile or an admin is updating someone else
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Forbidden! You can only update your own profile." });
        }

        // Hash new password if provided
        let updatedFields = { fullName, email, phone,gender,dateofBirth, role };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User updated successfully!", user: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// ✅ Delete User (User can delete their own account, Admin can delete anyone)
router.delete("/delete/:id", authMiddleware(), async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the logged-in user is deleting their own account or is an admin
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access Forbidden! You can only delete your own account." });
        }

        // Delete user
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User deleted successfully!" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});



// 🔹 Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" });
};


// 🔹 Role-Based Login Route
router.post("/login", expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required" });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user has a valid role
    const allowedRoles = ["member", "doctor", "admin","trainer","pharmacist", "receiptionist"];
    if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Access denied" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role, user.email);

    res.status(200).json({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token,
        expiresIn: 604800, // 7 days in seconds
        message: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} logged in successfully`,
    });
}));


module.exports = router;
