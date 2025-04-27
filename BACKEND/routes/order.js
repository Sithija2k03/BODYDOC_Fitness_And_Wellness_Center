const router = require("express").Router();
const multer = require("multer");
const path = require("path");
//import Order.js file
let Order = require("../models/Order");


// Set storage engine
const storage = multer.diskStorage({
    destination: "./uploads/", // Save files inside "uploads" folder
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

// File filter (only allow PDF, JPG, PNG)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf","image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."), false);
    }
};

// Upload settings
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});


// Route to add an order
router.post("/add", upload.single("prescription"), async (req, res) => {
  try {
    const { user_name, doctor_name, c_date } = req.body;
    const prescription = req.file ? req.file.path : null; // Store file path

    // Validate inputs
    if (!user_name || !doctor_name || !c_date || !prescription) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new order
    const newOrder = new Order({
      user_name,
      doctor_name,
      c_date: new Date(c_date),
      prescription, // Store the file path
    });

    // Save to database
    const savedOrder = await newOrder.save();
    res.status(201).json({ data: savedOrder });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: err.message });
  }
});


//data fatch
//http://localhost:4000/order
router.route("/").get((req,res)=>{
    //data take where the order table inserted
   Order.find().then((order)=>{
        res.json(order)
    }).catch((err)=>{
        console.log(err)
    })
});




//update
//http://localhost:4000/order/update/id
router.put("/update/:id", upload.single("prescription"), async (req, res) => {
   try{
    let orderId = req.params.id;
    const {c_id,user_name,doctor_name,c_date} = req.body;
    if (!req.file) {
        return res.status(400).json({ error: "Prescription file is required!" });
    }

    
    const cdate = new Date(req.body.c_date);
    if (isNaN(c_date.getTime())) {
        return res.status(400).json({ error: "Invalid date format! Use YYYY-MM-DD." });
    }

    const prescription = req.file.path;

    
    const updateOrder = {
        c_id,
        user_name,
        doctor_name,
        c_date,
    };
    if (prescription) updateOrder.prescription = prescription;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateOrder, { new: true });

    if (updatedOrder) {
        res.status(200).send({ status: "Order updated", data: updatedOrder });
    } else {
        res.status(404).send({ status: "Order not found" });
    }
} catch (err) {
    console.log(err);
    res.status(500).send({ status: "Error updating order", error: err.message });
}
});



//delete part
//(http//localhost:4000/Order/delete/id
router.route("/delete/:id").delete(async(req,res) => {
    let orderId = req.params.id;

    await Order.findByIdAndDelete(orderId).then(() => {
        res.status(200).send({status: "Order deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with delete user", error: err.message});
    })
})


//get data (read)
router.route("/get/:id").get(async(req,res) => {
    let orderId = req.params.id;


    await Order.findById(orderId)
        .then((order) => {
            res.status(200).send({ status: "Order fetched", order });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error fetching order", error: err.message });
        });
});

module.exports = router;