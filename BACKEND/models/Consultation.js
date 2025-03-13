const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    c_id : {
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
    c_date : {
        type : Date,
        required : true
    },
    prescription : {
        type : String,
    }
});


const Consultation = mongoose.model("Consultation",consultationSchema );

module.exports = Consultation;