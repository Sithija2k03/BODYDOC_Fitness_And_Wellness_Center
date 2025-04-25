// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET || "mykey";

// // Middleware to check authentication & roles
// const authMiddleware = (roles = []) => {
//     return (req, res, next) => {
//         const authHeader = req.header("Authorization");
        
//         if (!authHeader) {
//             return res.status(401).json({ message: "Access Denied! No token provided." });
//         }

//         try {
//             const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
//             const verified = jwt.verify(token, JWT_SECRET);

//             req.user = verified; // Attach user details to request
            
//             // Check if user role is allowed
//             if (roles.length > 0 && !roles.includes(req.user.role)) {
//                 return res.status(403).json({ message: "Access Forbidden! You don’t have permission." });
//             }

//             next(); // Proceed if authorized
//         } catch (error) {
//             return res.status(400).json({ message: "Invalid Token!" });
//         }
//     };
// };

// module.exports = authMiddleware;


const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "mykey";

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        try {
            const token = authHeader.split(" ")[1];
            const verified = jwt.verify(token, JWT_SECRET);
            req.user = verified; // Includes id, role, email
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Access Forbidden! You don’t have permission." });
            }
            next();
        } catch (error) {
            return res.status(400).json({ message: "Invalid Token!" });
        }
    };
};

module.exports = authMiddleware;