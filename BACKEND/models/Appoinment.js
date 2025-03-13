const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appoinmentSchema = new Schema({
    appoinment_id : {
        type : String,
    },
    user_name : {
        type : String,
        required : true
    },
    doctor_name : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    time_slot : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    }
});


const Appoinment = mongoose.model("Appoinment",appoinmentSchema );

module.exports = Appoinment;