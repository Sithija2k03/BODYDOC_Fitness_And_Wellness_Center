const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const staffSchema = new Schema({

      S_Member_Name: {
        type: String,
        required : true
      },
      
      email :{

       type: String,
       required: true
      },

      password : {
        type: String,
        required: true

      },

      role :{

        type: String,
        enum: ["admin","doctor","trainer"],
        required: true
      },


})


const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;