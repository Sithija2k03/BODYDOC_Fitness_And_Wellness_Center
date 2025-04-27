const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    facility_type: {
        type: String,
        enum: ["Gym", "Swimming Pool", "Badminton Court", "Pool Lounge"],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time_slot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Approved", "Declined"]
    },
});

module.exports = mongoose.model("Booking", bookingSchema);