const router = require("express").Router();
const mongoose = require("mongoose"); 
const Staff = require("../models/Staff");



//===============create  staff member route======
router.route("/add").post(async (req, res) => {
    try {
        const { S_Member_Name, email, password, role } = req.body;

       
        const newStaff = new Staff({
            
            S_Member_Name,
            email,
            password,
            role,
        });

        // Save the membership to the database
        await newStaff.save();

        // Send a success response
        res.status(201).json({ message: "Staff Member added successfully!" });

    } catch (error) {
        console.error("Error adding membership:", error);
        res.status(500).json({ message: "Error adding membership", error: error.message });
    }
});


// =============== Get All Staff Members ===============
router.route("/").get(async (req, res) => {
    try {
        const staffMembers = await Staff.find();

        if (!staffMembers || staffMembers.length === 0) {
            return res.status(404).json({ message: "No staff members found" });
        }

        res.status(200).json({ 
            message: "Staff members added successfully!",
            staffMembers
        });

    } catch (error) {
        console.error("Error fetching staff members:", error);
        res.status(500).json({ message: "Error fetching staff members", error: error.message });
    }
});

// =============== Get Staff Member by ID ===============
router.route("/:id").get(async (req, res) => {
    try {
        let staffId = req.params.id;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(staffId)) {
            return res.status(400).json({ message: "Invalid Staff ID format" });
        }

        const staff = await Staff.findById(staffId);

        if (!staff) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        res.status(200).json({ 
            message: "Staff member fetched successfully!",
            staff
        });

    } catch (error) {
        console.error("Error fetching staff member:", error);
        res.status(500).json({ message: "Error fetching staff member", error: error.message });
    }
});


//====================update staff members========

router.route("/update/:id").put(async(req,res) =>{
    let staffid = req.params.id;

    const{S_Member_Name, email,password,role } = req.body;

    const updateStaff= {
        S_Member_Name,
        email,
        password,
        role,
       
    }

    const update = await Staff.findByIdAndUpdate(staffid,updateStaff)
    .then(()=>{
        res.status(200).send({status: "Staff updated"})
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({status: "Error with updating Data",error:error.message});
    })
    
    
})

//==========delete membership=======

router.route("/delete/:id").delete(async(req,res) =>{
    let staffid = req.params.id;


    await Staff.findByIdAndDelete(staffid)
    .then(()=>{
        res.status(200).send({status:" staff Deleted"});

    }).catch((error)=>{
        console.log(error.message);
        res.status(500).send({status:"Error with delete staff membership", error: error.message});
    })
})


module.exports = router;





