const router = require("express").Router();
//import Appoinment.js file
let Appoinment = require("../models/Appoinment");



//data insert or add(create)(http://localhost:8070/appoinment/add)when we put this it call add part
router.post("/add-app", async (req, res) => {
    try {
    //now we create some objects to collects datas in model file
    const appoinment_id = req.body.appoinment_id;
    const user_name  = req.body.user_name;
    const doctor_name = req.body.doctor_name;
    const date = Date(req.body.date);
    const time_slot = req.body.time_slot;
    const status = req.body.status;
    
    // Validate time_slot
    const validTimeSlots = ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"];
    if (!validTimeSlots.includes(time_slot)) {
        return res.status(400).json({ error: "Invalid time slot selected" });
    }

    // Validate status
    const validStatuses = ["Pending", "Confirmed", "Cancelled", "Completed"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status selected" });
    }
    
    const newAppoinment = new Appoinment({
        appoinment_id,
        user_name,
        doctor_name,
        date :new Date(date),
        time_slot,
        status
    })

    // this object newAppoinment send to the database
    //javascript promise like if else
    await newConsultation.save();
    res.status(201).json({ message: "Consultation added successfully!", data: newConsultation });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});



//data fatch
//http://localhost:8070/appoinment
router.route("/").get((req,res)=>{
    //data take where the appoinment table inserted
    Appoinment.find().then((appoinment)=>{
        res.json(appoinment)
    }).catch((err)=>{
        console.log(err)
    })
})




//update
//http://localhost:8070/appoinment/update/id
router.route("/update/:id").put(async(req,res) => {
    let appoinmentId = req.params.id;
    const {appoinment_id,user_name,doctor_name,date,time_slot,status} = req.body;

    const updateAppoinment = {
        appoinment_id,
        user_name,
        doctor_name,
        date,
        time_slot,
        status
    }
    const update = await Appoinment.findByIdAndUpdate(appoinmentId,updateAppoinment).then(() =>{
        res.status(200).send({status: "Appoinment updated"})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "error with updating data",error : err.message});//when updating has any error then we can see this error msg on frontend
    })
})




//delete part
//(http//localhost:8070/appoinment/delete/id
router.route("/delete/:id").delete(async(req,res) => {
    let appoinmentId = req.params.id;

    await Appoinment.findByIdAndDelete(appoinmentId).then(() => {
        res.status(200).send({status: "Appoinment deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with delete user", error: err.message});
    })
})




//get data (read)
router.route("/get/:id").get(async(req,res) => {
    let appoinmentId = req.params.id;

    await Appoinment.findById(appoinmentId)
        .then((appoinment) => {
            res.status(200).send({ status: "Appoinment fetched", appoinment });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).send({ status: "Error fetching appoinment", error: err.message });
        });
});


module.exports = router;