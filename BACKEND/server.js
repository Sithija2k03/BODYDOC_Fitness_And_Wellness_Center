const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070; //starting 8070 port or available port

app.use(cors());
app.use(bodyParser.json());

//connect database
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(" MongoDB Connection Success!");
}).catch((error) => {
    console.error(" MongoDB Connection Error:", error);
});


//connection
const connection = mongoose.connection;
connection.once("open", () =>{
    console.log("Mongodb Connection success!");
})




//access phamacyInventory table file
const phamacyInventoryRouter = require("./routes/phamacyInventory.js");
//(http://localhost:8070/phamacyInventory)we use this for routes.phamacyInventory file
app.use("/phamacyInventory",phamacyInventoryRouter);//call backend to frontend


//access appoinment table file
const appoinmentRouter = require("./routes/appoinment.js");
//(http://localhost:8070/appoinment)we use this for routes.appoinment file
app.use("/appoinment",appoinmentRouter);//call backend to frontend

app.listen(PORT, () => {
    console.log('Server is up and running on port number: ${PORT}');
})
