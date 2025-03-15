// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();
// require("dotenv").config();

// const PORT = process.env.PORT || 8070;

// app.use(cors());
// app.use(bodyParser.json());

// const URL = process.env.MONGODB_URL;

// mongoose.connect(URL,{
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopologyL : true,
//     useFindAndModify : false
// });

// const connection = mongoose.connection;
// connection.once("open",()=>{
//     console.log("Mongodb Connection Success!");
// })

// app.listen(PORT, ()=>{
//     console.log('Server is up and running on port ${PORT}')
// })




// npm run dev






// process.on("SIGINT", () => {
//     console.log("Shutting down server...");
//     process.exit();
// });


// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();
// require("dotenv").config();

// // const PORT = process.env.PORT || 8090;
// const PORT = process.env.PORT || 5000;


// app.use(cors());
// app.use(bodyParser.json());

// const URL = process.env.MONGODB_URL;

// mongoose.connect(URL)
//     .then(() => {
//         console.log("MongoDB Connection Success!");
//     })
//     .catch((err) => {
//         console.error("MongoDB Connection Error:", err);
//     });

//     const helthRouter = require("./routes/helthR.js");

//     app.use("/helth",helthRouter); 

// app.listen(PORT, () => {
//     console.log(`Server is up and running on port ${PORT}`);
// });




const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL)
    .then(() => {
        console.log("MongoDB Connection Success!");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
    });

const helthRouter = require("./routes/helthR.js");
app.use("/helth", helthRouter);

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});

process.on("SIGINT", () => {
    console.log("Shutting down server...");
    process.exit();
});