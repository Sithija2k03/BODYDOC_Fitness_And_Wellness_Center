const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema =  new Schema({

    
        
    Name: {
        type: String,
        required : true
    },
    

    facility_type : {
        type: String,
        enum:["Gym","Swimming Pool","Badminton Court","Pool Lounge"],
        required : true
    },

    date: {
        type: Date,
        required: true
    },

    time_slot: {
        type: String,
        required : true
    },

    status: {
        type: String,
        required : true
    },

})

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
