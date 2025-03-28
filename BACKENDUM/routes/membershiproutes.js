
const router = require("express").Router();
const Membership = require("../models/membership");

// ================create membership ===========
router.route("/add").post(async (req, res) => {
    try {
        const { Name,membershipType,membershipPrice,StartDate,Benifits } = req.body;

       

        // Create a new membership
        const newMembership = new Membership({
            
            Name,
            membershipType,
            membershipPrice,
            StartDate,
            Benifits,
        });

        // Save the membership to the database
        await newMembership.save();

        // Send a success response
        res.status(201).json({ message: "Membership added successfully!" });

    } catch (error) {
        console.error("Error adding membership:", error);
        res.status(500).json({ message: "Error adding membership", error: error.message });
    }
});


//=== read membership======
router.route("/").get(async (req, res) => {
    try {
        const memberships = await Membership.find();

        if (!memberships || memberships.length === 0) {
            return res.status(404).json({ message: "No memberships found" });
        }

        res.status(200).json(memberships);
    } catch (error) {
        console.error("Error fetching memberships:", error);
        res.status(500).json({ message: "Error fetching memberships", error: error.message });
    }
});

//============fetching membership by Id=========
router.route("/:id").get(async (req, res) => {
    try {
        let membershipId = req.params.id; // Correctly fetching ID from the URL parameter
        const membership = await Membership.findById(membershipId);

        if (!membership) {
            return res.status(404).json({ message: "Membership not found" });
        }

        res.status(200).json(membership);
    } catch (error) {
        console.error("Error fetching membership:", error);
        res.status(500).json({ message: "Error fetching membership", error: error.message });
    }
});



//=============update membership==========

router.route("/update/:id").put(async(req,res) =>{
    let membershipid = req.params.id;

    const{Name, membershipType,membershipPrice,StartDate,Benifits } = req.body;

    const updateMembership= {
        Name,
        membershipType,
        membershipPrice,
        StartDate,
        Benifits,
    }

    const update = await Membership.findByIdAndUpdate(membershipid,updateMembership)
    .then(()=>{
        res.status(200).send({status: "membership updated"})
    }).catch((error)=>{
        console.log(error);
        res.status(500).send({status: "Error with updating Data",error:error.message});
    })
    
    
})

//==========delete membership=======

router.route("/delete/:id").delete(async(req,res) =>{
    let membershipid = req.params.id;


    await Membership.findByIdAndDelete(membershipid)
    .then(()=>{
        res.status(200).send({status:" membership Deleted"});

    }).catch((error)=>{
        console.log(error.message);
        res.status(500).send({status:"Error with delete membership", error: error.message});
    })
})



module.exports = router;