const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { decodToken } = require("../models/jwt");




require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "mykey";

// User Registration Route
router.route("/add").post(async (req, res) => {
    try {
        const { fullName, email, password, phone,  role, createdAt } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });  // FIXED: findOne() should be correctly written
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const myEncPassword = await bcrypt.hash(password, salt);
       
        

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password : myEncPassword,
            phone,
            role,
            createdAt,
        });

        // Save the user to the database
        await newUser.save();

        // Send a success response
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});


// Read All Users
router.route("/").get(async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// Read a Single User by Email
router.route("/:email").get(async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email }); // Find user by email

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

//=========login user=====

router.post("/login", async (req, res) => {
    try {
        const { fullName, password } = req.body;

        console.log("Login Attempt:", fullName, password);

        // Normalize fullName for case-insensitive search
        const user = await User.findOne({ fullName: fullName.trim().toLowerCase() });
        console.log("User Found:", user);

        if (!user) {
            return res.status(400).json({ message: "User not found. Check full name spelling." });
        }

        // Check password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, fullName: user.fullName, role: user.role },
            JWT_SECRET,  // Use the global JWT_SECRET
            { expiresIn: "1h" }
        );

        console.log("Generated Token:", token); // Debugging

        // Send response with token
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Error logging in", error: error.message });
    }
});



// Validate Token Route
router.post("/validate", async (req, res) => {
    try {
        const { token } = req.body; // Get the token from request body
        console.log("Received Token:", token);

        // Verify the token using jwt.verify()
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded Token:", decoded);

        res.status(200).json({ valid: true, user: decoded });

    } catch (error) {
        console.error("Token validation error:", error.message);
        res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
});





//========authMiddleware==============
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
        const verified = jwt.verify(token, mykey);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token!" });
    }
};


// update profile

router.route("/update/:id").put(async(req,res) =>{
    let userid = req.params.id;

    const{fullName, email, password, phone,  role, createdAt } = req.body;

    const updateUser = {
        fullName,
        email,
        password,
        phone,
        role,
        createdAt
    }

    const update = await User.findByIdAndUpdate(userid,updateUser)
    .then(()=>{
        res.status(200).send({status: "user updated"})
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({status: "Error with updating Data",error:error.message});
    })
    
    
})

//=============Delete user============

router.route("/delete/:id").delete(async(req,res) =>{
    let userid = req.params.id;


    await User.findByIdAndDelete(userid)
    .then(()=>{
        res.status(200).send({status:" User Deleted"});

    }).catch((error)=>{
        console.log(error.message);
        res.status(500).send({status:"Error with delete user", error: error.message});
    })
})





module.exports = router;
