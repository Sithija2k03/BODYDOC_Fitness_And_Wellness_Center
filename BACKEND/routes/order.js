const router = require("express").Router();
const multer = require("multer");
const path = require("path");
//import Order.js file
let Order = require("../models/Order");


// const storage = multer.memoryStorage(); // Store file in memory or update for disk storage
// const upload = multer({ storage: storage });

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


//data insert or add(create)(http://localhost:8070/order/add)when we put this it call add part
router.post("/add", upload.single("prescription"),async (req, res) => {
    try {
    //now we create some objects to collects datas in model file
    const c_id = req.body.c_id;
    const user_name  = req.body.user_name;
    const doctor_name = req.body.doctor_name;
    const c_date = new Date(req.body.c_date);
    const prescription = req.file ?  req.file.path : "";
   
    const newOrder = new Order({
        c_id,
        user_name,
        doctor_name,
        c_date,
        prescription

    });

// this object newOrder send to the database
    //javascript promise like if else
    await newOrder.save();
    res.status(201).json({ message: "Order added successfully!", data: newOrder });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});


//data fatch
//http://localhost:8070/order
router.route("/").get((req,res)=>{
    //data take where the order table inserted
   Order.find().then((order)=>{
        res.json(order)
    }).catch((err)=>{
        console.log(err)
    })
})




//update
//http://localhost:8070/order/update/id
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
//(http//localhost:8070/Order/delete/id
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