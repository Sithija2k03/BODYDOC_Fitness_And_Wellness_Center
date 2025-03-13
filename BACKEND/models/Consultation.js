const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    c_id : {
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
    c_date : {
        type : Date,
        required : true
    },
    prescription : {
        type : String,
    }
});
// Auto-generate c_id before saving a new consultation
consultationSchema.pre("save", async function (next) {
    if (!this.c_id) {
        const lastConsultation = await Consultation.findOne().sort({ c_id: -1 });

        if (lastConsultation && lastConsultation.c_id) {
            // Extract the number from last c_id and increment
            let lastNumber = parseInt(lastConsultation.c_id.substring(1)) || 0;
            this.c_id = `C${(lastNumber + 1).toString().padStart(2, "0")}`; // Format as C01, C02...
        } else {
            this.c_id = "C01"; // Default for the first entry
        }
    }
    next();
});

const Consultation = mongoose.model("Consultation",consultationSchema );

module.exports = Consultation;