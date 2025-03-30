const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const membershipSchema =  new Schema({

    Name: {
        type: String,
        required : true
    },

    membershipType: {
        type: String,
        enum:["Annual","Monthly"],
        required : true
    },

    membershipPrice: {
        type: String,
        required: true
    },

    StartDate: {
        type: String,
        required: true
    },

    Benifits: {
        type : String,
        required : true
    },

})

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;

      





