const express = require("express");
const router = require("express").Router();
//import Order.js file
let Order = require("../models/Order");



//data insert or add(create)(http://localhost:8070/order/add)when we put this it call add part
router.post("/add-order" , async (req,res) => {
    try{
    //now we create some objects to collects datas in model file
    const order_id = req.body.order_id;
    const item_id  = req.body.item_id;
    const supplier_name = req.body.supplier_name;
    const quality = req.body.quality;
    const total = Number(req.body.total)
    
    // Validate status
    const validQuality= ["Good", "Near Expiry", "Expired", "Damaged", "Low Stock"];
    if (!validQuality.includes(quality)) {
        return res.status(400).json({ error: "Invalid quality selected" });
    }

    const newOrder = new Order({
        order_id,
        item_id,
        supplier_name,
        quality,
        total
    });
    await newOrder.save();
    res.status(201).json({ message: "Order Added Successfully", data: newOrder });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});

    // this object newOrder send to the database
    //javascript promise like if else
    router.post("/add-quality", async (req, res) => {
        try {
            const { quality } = req.body;
    
            const newQuality = new Order({ quality });
    
            await newQuality.save();
            res.status(201).json({ message: "Quality added successfully!", data: newQuality });
        } catch (error) {
            res.status(400).json({ error: error.message });
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
    const {order_id,item_id,supplier_name,quality,total} = req.body;

    const updateInventory = {
        order_id,
        item_id,
        supplier_name,
        quality,
        total
    }
    const update = await Order.findByIdAndUpdate(orderId,updateInventory).then(() =>{
        res.status(200).send({status: "Order updated"})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "error with updating data",error : err.message});//when updating has any error then we can see this error msg on frontend
    })
})




//delete part
//(http//localhost:8070/order/delete/id
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