const router = require("express").Router();
let Student = require("BACKEND/models/Student.js");

//data insert or add
router.route("/add").post((req,res) => {
    //now we create some objects to collects datas in model file
    const name = req.body.name;
    const age = Number(req.body.age);
    const gender = req.body.gender;

    const newStudent = new Student({
        name,
        age,
        gender
    })

    //javascript promise like if else
    newStudent.save().then(() =>{
        req.json("Student Added")
    }).catrch((err) =>{
        console.log(err);
    })
})

//data fatch
router.route("/").get((req,res)=>{
    //data take where the Student table inserted
    Student.find().then((student)=>{
        res.json(students)
    }).catch((err)=>{
        console.log(err)
    })
})

//update
router.route("/")









module.exports = router;