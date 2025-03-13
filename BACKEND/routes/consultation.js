const router = require("express").Router();
//import Consultation.js file
let Consultation = require("../models/Consultation");



//data insert or add(create)(http://localhost:8070/consultation/add)when we put this it call add part
router.route("/add").post((req,res) => {
    //now we create some objects to collects datas in model file
    const c_id = req.body.c_id;
    const user_name  = req.body.user_name;
    const doctor_name = req.body.doctor_name;
    const c_date = Date(req.body.c_date);
    const prescription = (req.body.prescription);
   
    const newConsultation = new Consultation({
        c_id,
        user_name,
        doctor_name,
        c_date,
        prescription

    })

    // this object newConsultation send to the database
    //javascript promise like if else
    newConsultation.save().then(() =>{
        res.json("Consultation Added")
    }).catch((err) =>{
        console.log(err);
    })
})



//data fatch
//http://localhost:8070/consultation
router.route("/").get((req,res)=>{
    //data take where the consultation table inserted
    Consultation.find().then((consultation)=>{
        res.json(consultation)
    }).catch((err)=>{
        console.log(err)
    })
})




//update
//http://localhost:8070/consultation/update/id
router.route("/update/:id").put(async(req,res) => {
    let consultationId = req.params.id;
    const {c_id,user_name,doctor_name,c_date,prescription} = req.body;

    const updateConsultation = {
        c_id,
        user_name,
        doctor_name,
        c_date,
        prescription
    }
    const update = await Consultation.findByIdAndUpdate(consultationId,updateConsultation).then(() =>{
        res.status(200).send({status: "Consultation updated"})
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "error with updating data",error : err.message});//when updating has any error then we can see this error msg on frontend
    })
})




//delete part
//(http//localhost:8070/Consultation/delete/id
router.route("/delete/:id").delete(async(req,res) => {
    let consultationId = req.params.id;

    await Consultation.findByIdAndDelete(consultationId).then(() => {
        res.status(200).send({status: "Consultation deleted"});
    }).catch((err) => {
        console.log(err.message);
        res.status(500).send({status: "Error with delete user", error: err.message});
    })
})




//get data (read)
router.route("/get/:id").get(async(req,res) => {
    let consultationId = req.params.id;

    const consultation = await Consultation.findById(ConsultationId).then((inventory) => {
        res.status(200).send({status: "Consultation fetched",consultation})
    }).catch(()=>{
        console.log(err.message);
        res.status(500).send({status: "Error with get inventory" , error: err.message});
    })
})


module.exports = router;