const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const membershipSchema =  new Schema({

    Name: {
        type: String,
        required : true
    },

    membershipType: {
        type: String,
        enum:["Basic","Premium","VIP"],
        required : true
    },

    StartDate: {
        type: String,
        required: true
    },

    EndDate : {
        type : String,
        required : true
    },

})

const Membership = mongoose.model("Membership", membershipSchema);

module.exports = Membership;

      





