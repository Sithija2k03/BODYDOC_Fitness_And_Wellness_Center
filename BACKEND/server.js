const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config(); // No need for require("dotenv").config();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGO_URL;

// ✅ Corrected MongoDB Connection
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // ✅ Fixed typo
}).then(() => {
    console.log(" MongoDB Connection Success!");
}).catch((error) => {
    console.error(" MongoDB Connection Error:", error);
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log(" MongoDB Database Connected Successfully!"); 
});


// Import Routes

const userRouter = require("./routes/users.js");
const membershipRouter = require("./routes/membershiproutes.js");
const staffRouter = require("./routes/staffroutes.js");
const bookingRouter = require("./routes/bookings.js");

// Use Routes

app.use("/user", userRouter);
app.use("/membership", membershipRouter);
app.use("/staff", staffRouter);
app.use("/booking", bookingRouter);


app.listen(PORT, () => {
    console.log(` Server is up and running on port number: ${PORT}`);
});
