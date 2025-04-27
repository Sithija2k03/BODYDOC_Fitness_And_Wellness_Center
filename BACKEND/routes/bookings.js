const router = require("express").Router();
const Booking = require("../models/booking");
const authMiddleware = require("../Middleware/authMiddleware");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

//=========create bookings======
router.route("/add-book").post(async (req, res) => {
    try {
        const { Name, email, facility_type, date, time_slot } = req.body;
        
        // Create a new booking
        const newBooking = new Booking({
            Name,
            email,
            facility_type,
            date,
            time_slot,
            status: "Pending",
        });

        // Save the booking to the database
        await newBooking.save();

        // Send a success response
        res.status(201).json({ message: "Booking added successfully!" });
    } catch (error) {
        console.error("Error adding booking:", error);
        res.status(500).json({ message: "Error adding booking", error: error.message });
    }
});

//=== read booking======
router.route("/").get(async (req, res) => {
    try {
        const bookings = await Booking.find();

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No booking found" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
});

//============fetching booking by Id=========
router.route("/:id").get(async (req, res) => {
    try {
        let bookingId = req.params.id;
        
        // Check if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            // If not, it might be an email, but this route is for ObjectId lookups
            return res.status(404).json({ message: "Invalid booking ID format" });
        }
        
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Error fetching booking", error: error.message });
    }
});

//=============update booking==========
router.route("/update/:id").put(async (req, res) => {
    let bookingid = req.params.id;

    const { Name, facility_type, date, time_slot, status } = req.body;

    const updateBooking = {
        Name,
        facility_type,
        date,
        time_slot,
        status,
    };

    await Booking.findByIdAndUpdate(bookingid, updateBooking)
        .then(() => {
            res.status(200).send({ status: "Booking updated" });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status: "Error with updating Data", error: error.message });
        });
});

//==========delete booking=======
router.route("/delete/:id").delete(async (req, res) => {
    let bookingid = req.params.id;

    await Booking.findByIdAndDelete(bookingid)
        .then(() => {
            res.status(200).send({ status: "Booking Deleted" });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).send({ status: "Error with delete booking", error: error.message });
        });
});

// Search booking by Name
router.route("/search/:name").get(async (req, res) => {
    try {
        let bookingName = req.params.name;

        const bookings = await Booking.find({ Name: { $regex: bookingName, $options: "i" } });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found with this name" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error searching bookings:", error);
        res.status(500).json({ message: "Error searching bookings", error: error.message });
    }
});

// Get bookings by specific user email - Fixed to match frontend URL path
router.route("/bookings/:id").get(async (req, res) => {
    try {
        const email = req.params.id;
        const bookings = await Booking.find({ email });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this email" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings by email:", error);
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
});

// Update booking status
router.put("/status/:id", async (req, res) => {
    const { status } = req.body;

    try {
        console.log(`PUT /booking/status/${req.params.id} called with status:`, status);

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid booking ID format" });
        }

        // Validate status
        const validStatuses = ["Pending", "Approved", "Declined"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        // Find booking
        console.log("Finding booking by ID:", req.params.id);
        const booking = await Promise.race([
            Booking.findById(req.params.id),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Database query timeout")), 5000))
        ]);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Log booking document for debugging
        console.log("Booking document:", booking);

        // Check for email
        if (!booking.email) {
            return res.status(400).json({ message: "Booking is missing required email field" });
        }

        // Update status
        console.log("Updating booking status to:", status);
        booking.status = status;
        const updated = await Promise.race([
            booking.save(),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Database save timeout")), 5000))
        ]);
        console.log("Booking updated:", updated);

        // Validate email credentials
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.warn("Email not sent: Missing GMAIL_USER or GMAIL_APP_PASSWORD");
            return res.json({
                message: "Booking status updated, but email not sent due to missing credentials",
                booking: updated
            });
        }

        // Send email
        console.log("Setting up nodemailer transport...");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: `"Fitness Center" <${process.env.GMAIL_USER}>`,
            to: booking.email,
            subject: `Your Booking Status: ${status}`,
            html: `
                <h2>Booking Status Update</h2>
                <p>Dear ${booking.Name},</p>
                <p>Your booking for <strong>${booking.facility_type}</strong> on <strong>${new Date(booking.date).toLocaleDateString()}</strong> at <strong>${booking.time_slot}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>
                <p>Thank you for choosing our Fitness Center!</p>
                <p>Best regards,<br>Fitness Center Team<br>Email: ${process.env.GMAIL_USER}</p>
                <p><small>If you did not make this booking, please contact us immediately.</small></p>
            `
        };

        console.log("Sending email to:", booking.email);
        await Promise.race([
            transporter.sendMail(mailOptions),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Email send timeout")), 5000))
        ]);
        console.log("Email sent successfully");

        res.json(updated);
    } catch (error) {
        console.error("Error updating status or sending email:", error);
        res.status(500).json({ message: "Error updating status or sending email", error: error.message });
    }
});

module.exports = router;