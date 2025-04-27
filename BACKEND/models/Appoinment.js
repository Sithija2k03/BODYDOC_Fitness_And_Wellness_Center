const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appoinmentSchema = new Schema({
    appoinment_id : {
        type : String,
        unique:true
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
    time_slot: {
        type: String,
        required: true,
        enum: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"]
    },

});

const Appoinment = mongoose.model("Appoinment",appoinmentSchema );

module.exports = Appoinment;

































// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const appoinmentSchema = new Schema({
//     appoinment_id : {
//         type : String,
//         unique:true
//     },
//     user_name : {
//         type : String,
//         required : true
//     },
//     doctor_name : {
//         type : String,
//         required : true
//     },
//     date : {
//         type : Date,
//         required : true
//     },
//     time_slot: {
//         type: String,
//         required: true,
//         enum: ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"]
//     },

// });

// // // Auto-generate appoinment_id before saving a new consultation
// // appoinmentSchema.pre("save", async function (next) {
// //     if (!this.appoinment_id) {
// //         const lastAppoinment = await Appoinment.findOne().sort({ appoinment_id: -1 });

// //         if (lastAppoinment && lastAppoinment.appoinment_id) {
// //             // Extract the number from last appoinment_id and increment
// //             let lastNumber = parseInt(lastAppoinment.appoinment_id.substring(1)) || 0;
// //             this.appoinment_id = `A${(lastNumber + 1).toString().padStart(2, "0")}`; // Format as A01, C02...
// //         } else {
// //             this.appoinment_id = "A01"; // Default for the first entry
// //         }
// //     }
// //     next();
// // });
// const Appoinment = mongoose.model("Appoinment",appoinmentSchema );

// module.exports = Appoinment;