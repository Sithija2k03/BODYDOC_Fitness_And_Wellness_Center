const router = require("express").Router();
//import Appoinment.js file
let Appoinment = require("../models/Appoinment");


router.post("/add", async (req, res) => {
    try {
    //now we create some objects to collects datas in model file
    const appoinment_id = req.body.appoinment_id;
    const user_name  = req.body.user_name;
    const doctor_name = req.body.doctor_name;
    const date = Date(req.body.date);
    const time_slot = req.body.time_slot;

    
    // Validate time_slot
    const validTimeSlots = ["09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM"];
    if (!validTimeSlots.includes(time_slot)) {
        return res.status(400).json({ error: "Invalid time slot selected" });
    }
    
    const newAppoinment = new Appoinment({
        appoinment_id,
        user_name,
        doctor_name,
        date :new Date(date),
        time_slot,

    })

    // this object newAppoinment send to the database
    //javascript promise like if else
    await newAppoinment.save();
    res.status(201).json({ message: "Appoinment added successfully!", data: newAppoinment });
} catch (error) {
    res.status(500).json({ error: error.message });
}
});



//data fatch
//http://localhost:4000/appoinment
router.route("/").get((req,res)=>{
    //data take where the appoinment table inserted
    Appoinment.find().then((appoinment)=>{
        res.json(appoinment)
    }).catch((err)=>{
        console.log(err)
    })
})


//update
//http://localhost:4000/appoinment/update/id
router.route("/update/:id").put(async(req,res) => {
    let appoinmentId = req.params.id;
    const {appoinment_id,user_name,doctor_name,date,time_slot} = req.body;

    const updateAppoinment = {
        appoinment_id,
        user_name,
        doctor_name,
        date,
        time_slot
    }
    const update = await Appoinment.findByIdAndUpdate(appoinmentId,updateAppoinment).then(() =>{
        res.status(200).send({status: "Appoinment updated"})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "error with updating data",error : err.message});//when updating has any error then we can see this error msg on frontend
    })
})




//delete part
//(http//localhost:4000/appoinment/delete/id
router.route("/delete/:id").delete(async(req,res) => {
    let appoinmentId = req.params.id;

    await Appoinment.findByIdAndDelete(appoinmentId).then(() => {
        res.status(200).send({status: "Appoinment deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: 'Failed to delete appointment', error: err.message});
    })
})




// get all appointments with all attributes
router.route("/get").get(async (req, res) => {
    try {
      // Fetch all appointments and populate all attributes
      const appointments = await Appoinment.find(); // No need for specific field selection, this fetches all fields
  
      // Check if there are appointments
      if (appointments.length > 0) {
        res.status(200).send({ status: "Appointments fetched", appointments });
      } else {
        res.status(404).send({ status: "No appointments found" });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ status: "Error fetching appointments", error: err.message });
    }
  });
  
  


module.exports = router;