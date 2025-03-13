const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phamacySchema = new Schema({
    item_id : {
        type : String,
    },
    name : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    stock_quality : {
        type : String,
        required : true
    },
    reorder_level : {
        type : Number,
        required : true
    },
    supplier : {
        type : String,
        required : true
    },
    expiry_date : {
        type : Date,
        required : true
    }
});


const PhamacyInventory = mongoose.model("PhamacyInventory",phamacySchema );

module.exports = PhamacyInventory;