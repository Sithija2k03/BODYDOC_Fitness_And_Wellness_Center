// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();

// require("dotenv").config();

// const PORT = process.env.PORT || 7000;

// app.use(cors());
// app.use(bodyParser.json());

// const URL = process.env.MONGODB_URL;

// mongoose.connect(URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

// const connection = mongoose.connection;
// connection.once("open", () => {
//     console.log("MongoDB Connection Success!");
// });


// const supplierRouter = require("./routes/suppliers.js");

// app.use("/supplier", supplierRouter);

// app.listen(PORT, () => {
//     console.log(`Server is up and running on port number: ${PORT}`);

// });





const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB Connection Success!");
}).on("error", (err) => {
    console.error("MongoDB Connection Error:", err);
});

const supplierRouter = require("./routes/suppliers.js");
app.use("/supplier", supplierRouter);

app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});