// const router = require("express").Router();
// let Helth = require("../models/helth.js");

// router.route("/add").post((req,res)=>{

// const  name =req.body.name;
// const email=req.body.email;
// const password=req.body.password;
// const age=Number(req.body.age);
// const weight=Number(req.body.weight);
// const fitnessGoal=req.body.fitnessGoal;

// const newHelth = new Helth ({
//         name,
//         email,
//         password,
//         age,
//         weight,
//         fitnessGoal
//     })

//     newHelth.save().then(()=>{
//         res.json("Helth Added")
//     }).catch((err)=>{
//         console.log(err);
//     })

// })

// //http://localhost:5000/helth

// router.route("/").get((req,res)=>{

//     Helth.find().then((helth)=>{
//         res.json(helth)
//     }).catch((err)=>{
//         console.log(err)
//     })
// })

// //http://localhost:5000/helth/update/

// router.route("/update/:id").put(async (req,res)=>{
//     let userId = req.params.id;
//     const {name,email,password,age,weight,fitnessGoal}=req.body;

//     const updateHelth = {
//         name,email,password,age,weight,fitnessGoal
//     }

//     const update = await Helth.findByIdAndUpdate(userId, updateHelth).then(()=>{
//         res.status(200).send({status : "User updated", user:update})
//     }).catch((err)=>{
//         console.log(err);
//         res.status(500).send({status:"Error with updating data"});
//     }) //await using for waitining for update user details

   
// })


// router.route("/delete/:id").delete(async(req,res)=>{
//     let userId= req.params.id;
//     await Helth.findByIdAndDelete(userId).then(()=>{
//         res.status(200).send({status: "User deleted"});
//     }).catch((err)=>{
//         console.log(err.message);
//         res.status(500).send({status: "Error with deleting user", error: err.message});
//     })
// })

// router.route("/get/:id").get(async(req,res)=>{
//     let userId = req.params.id;
//     const user = await Helth.findById(userId).then(() =>{
//         res.status(200).send({status:"User fetched",user: user})
//     }).catch(()=> {
//         console.log(err.message);
//         res.status(500).send({status: "Error with get user",error: err.message});
//     })
// })

// module.exports = router;




const router = require("express").Router();
const Helth = require("../models/helth.js");

router.route("/add").post((req, res) => {
    const { name, email, password, age, weight, fitnessGoal } = req.body;

    const newHelth = new Helth({
        name,
        email,
        password,
        age,
        weight,
        fitnessGoal
    });

    newHelth.save()
        .then(() => res.json("Health Added"))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/").get((req, res) => {
    Helth.find()
        .then(helth => res.json(helth))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/update/:id").put(async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, age, weight, fitnessGoal } = req.body;

    const updateHelth = {
        name, email, password, age, weight, fitnessGoal
    };

    Helth.findByIdAndUpdate(userId, updateHelth, { new: true })
        .then(user => res.status(200).send({ status: "User updated", user }))
        .catch(err => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

router.route("/delete/:id").delete(async (req, res) => {
    const userId = req.params.id;
    Helth.findByIdAndDelete(userId)
        .then(() => res.status(200).send({ status: "User deleted" }))
        .catch(err => res.status(500).send({ status: "Error with deleting user", error: err.message }));
});

router.route("/get/:id").get(async (req, res) => {
    const userId = req.params.id;
    Helth.findById(userId)
        .then(user => res.status(200).send({ status: "User fetched", user }))
        .catch(err => res.status(500).send({ status: "Error with get user", error: err.message }));
});

module.exports = router;