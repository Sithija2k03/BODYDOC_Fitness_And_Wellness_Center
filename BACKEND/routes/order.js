const router = require("express").Router();
//import Order.js file
let Order = require("../models/Order");
// const multer = require("multer");

// const storage = multer.memoryStorage(); // Store file in memory or update for disk storage
// const upload = multer({ storage: storage });

//data insert or add(create)(http://localhost:8070/order/add)when we put this it call add part
router.post("/add", async (req, res) => {
    try {
    //now we create some objects to collects datas in model file
    const c_id = req.body.c_id;
    const user_name  = req.body.user_name;
    const doctor_name = req.body.doctor_name;
    const c_date = Date(req.body.c_date);
    const prescription = (req.body.prescription);
   
    const newOrder = new Order({
        c_id,
        user_name,
        doctor_name,
        c_date : new Date(c_date),
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
router.route("/update/:id").put(async(req,res) => {
    let orderId = req.params.id;
    const {c_id,user_name,doctor_name,c_date,prescription} = req.body;

    const updateOrder = {
        c_id,
        user_name,
        doctor_name,
        c_date,
        prescription
    }
    const update = await Order.findByIdAndUpdate(orderId,updateOrder).then(() =>{
        res.status(200).send({status: "Order updated"})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "error with updating data",error : err.message});//when updating has any error then we can see this error msg on frontend
    })
})




//delete part
//(http//localhost:8070/Order/delete/id
router.route("/delete/:id").delete(async(req,res) => {
    let consultationId = req.params.id;

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