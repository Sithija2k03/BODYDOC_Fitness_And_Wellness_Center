const router = require("express").Router();
//import PhamacyInventory.js file
let PhamacyInventory = require("../models/PhamacyInventory");



//data insert or add(create)(http://localhost:8070/phamacyInventory/add)when we put this it call add part
router.route("/add").post((req,res) => {
    //now we create some objects to collects datas in model file
    const item_id = req.body.item_id;
    const name  = req.body.name;
    const category = req.body.category;
    const stock_quality = req.body.stock_quality;
    const reorder_level = Number(req.body.reorder_level);
    const supplier = req.body.supplier;
    const expiry_date = Date(req.body.expiry_date);

    const newPhamacyInventory = new PhamacyInventory({
        item_id,
        name,
        category,
        stock_quality,
        reorder_level,
        supplier,
        expiry_date
    })

    // this object newPhamacyInventory send to the database
    //javascript promise like if else
    newPhamacyInventory.save().then(() =>{
        res.json("Inventory Added")
    }).catch((err) =>{
        console.log(err);
    })
})



//data fatch
//http://localhost:8070/phamacyInventory
router.route("/").get((req,res)=>{
    //data take where the inventory table inserted
    PhamacyInventory.find().then((phamacyInventory)=>{
        res.json(phamacyInventory)
    }).catch((err)=>{
        console.log(err)
    })
})




//update
//http://localhost:8070/phamacyInventory/update/id
router.route("/update/:id").put(async(req,res) => {
    let inventoryId = req.params.id;
    const {item_id,name,category,stock_quality,reorder_level,supplier,expiry_date} = req.body;

    const updateInventory = {
        item_id,
        name,
        category,
        stock_quality,
        reorder_level,
        supplier,
        expiry_date
    }
    const update = await PhamacyInventory.findByIdAndUpdate(inventoryId,updateInventory).then(() =>{
        res.status(200).send({status: "Inventory updated"})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "error with updating data",error : err.message});//when updating has any error then we can see this error msg on frontend
    })
})




//delete part
//(http//localhost:8070/phamacyInventory/delete/id
router.route("/delete/:id").delete(async(req,res) => {
    let inventoryId = req.params.id;

    await PhamacyInventory.findByIdAndDelete(inventoryId).then(() => {
        res.status(200).send({status: "Inventory deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with delete user", error: err.message});
    })
})




//get data (read)
router.route("/get/:id").get(async(req,res) => {
    let inventoryId = req.params.id;

    const inventory = await PhamacyInventory.findById(inventoryId).then((inventory) => {
        res.status(200).send({status: "Inventory fetched",inventory})
    }).catch(()=>{
        console.log(err.message);
        res.status(500).send({status: "Error with get inventory" , error: err.message});
    })
})


module.exports = router;