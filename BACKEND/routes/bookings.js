const router = require("express").Router();
const Booking = require("../models/booking");

//=========create bookings======

router.route("/add").post(async (req, res) => {
    try {
        const { Name,facility_type,date,time_slot,status} = req.body;

       

        // Create a new booking
        const newBooking = new Booking({
            
            Name,
            facility_type,
            date,
            time_slot,
            status,
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
        let bookingId = req.params.id; // Correctly fetching ID from the URL parameter
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Bookings not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Error fetching booking", error: error.message });
    }
});


//=============update membership==========

router.route("/update/:id").put(async(req,res) =>{
    let bookingid = req.params.id;

    const{Name,facility_type,date,time_slot,status  } = req.body;

    const updateBooking= {
        Name,
        facility_type,
        date,
        time_slot,
        status,
    }

    const update = await Booking.findByIdAndUpdate(bookingid,updateBooking)
    .then(()=>{
        res.status(200).send({status: "Booking updated"})
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({status: "Error with updating Data",error:error.message});
    })
    
    
})


//==========delete membership=======

router.route("/delete/:id").delete(async(req,res) =>{
    let bookingid = req.params.id;


    await Booking.findByIdAndDelete(bookingid)
    .then(()=>{
        res.status(200).send({status:" booking Deleted"});

    }).catch((error)=>{
        console.log(error.message);
        res.status(500).send({status:"Error with delete booking", error: error.message});
    })
})

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




module.exports = router;