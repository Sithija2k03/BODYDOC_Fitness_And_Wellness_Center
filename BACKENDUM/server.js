const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

// Import Models & Routes
const User = require("./models/user.js");
const userRouter = require("./routes/users.js");
const membershipRouter = require("./routes/membershiproutes.js");
const staffRouter = require("./routes/staffroutes.js");
const bookingRouter = require("./routes/bookings.js");

const PORT = process.env.PORT || 8070;

// Fix JWT user issue (ensure it's defined)
const sampleUser = { _id: "1234567890" }; // Dummy user for testing
const token = jwt.sign({ userId: sampleUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGO_URL;

// ✅ Corrected MongoDB Connection
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ MongoDB Connection Success!");
}).catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
});

// ✅ Ensure DB Connection Open
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("✅ MongoDB Database Connected Successfully!");
});

// ✅ Use Routes
app.use("/user", userRouter);
app.use("/membership", membershipRouter);
app.use("/staff", staffRouter);
app.use("/booking", bookingRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on port number: ${PORT}`);
});
