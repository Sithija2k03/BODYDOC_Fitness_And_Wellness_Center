const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    fullName : {
        type : String,
        required: true,
        unique: true
    },

    email: {
        type : String,
        required: true,
        unique: true 
    },

    password : {
        type : String,
        required : true
    },

    phone : {
        type : String,
        required: true
    },

    role: {
        type: String,
        enum: ["member", "admin", "doctor","trainer", "pharmacist", "receptionist" ],
        default: "user"
    },
    
    createdAt : {
        type : Date,
        default: Date.now
    },

})




const User = mongoose.model("User", userSchema);

module.exports = User;