// const router = require("express").Router();
// let Supplier = require("../models/supplier");

// // Route to add a new supplier
// router.route("/add").post((req, res) => {
//     // const supplier_id = Number(req.body.supplieId);
//     // const supplier_name = req.body.supplieName;
//     // const contact = req.body.supplierContact;
//     // const credits = Number(req.body.supplierCredite);
//     const {supplier_id, supplier_name, contact, credits} = req.body;

//     const newSupplier = new Supplier({
//         supplier_id,
//         supplier_name,
//         contact,
//         credits

//     })

//     newSupplier.save()
//     .then(() => {
//         res.json("Supplier Added");
//     })
//     .catch((err) => {
//         console.error("Error adding supplier:", err);
//         res.status(500).json({ error: err.message });
//     });

// })


// router.route("/").get((req, res) =>{
//     Supplier.find().then((suppliers) =>{
//         res.json(suppliers);
//     }).catch((err) => {
//         console.log(err);
//     })
// })


// router.route("/update/:supid").put(async (req, res) => {
//     let supplierID = req.params.supid;
//     const {supplier_name, contact, credits} = req.body;


//     const updateSupplier = {
//         supplier_name,
//         contact,
//         credits
//     }

//     try {
//         const update = await Supplier.findOneAndUpdate(
//             { supplierID: updateSupplier },
//             updateSupplier,
//             { new: true }
//         );

//         if (!update) {
//             return res.status(404).json({ message: "Supplier not found" });
//         }

//         res.status(200).json({ message: "Supplier updated", supplier: update });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }

//     })



// router.route("/delete/:supid").delete(async (req, res) => {
//     let supplierID = req.params.supid;

//     await Supplier.findByIdAndDelete(supplierID)
//     .then(() => {
//         res.status(200).send({status: "User deleted"});
//     }).catch((err) => {
//         console.log(err.massage);
//         res.status(500).send({status: "Error with delete data", erroe: err.massage})
//     })
// })




// module.exports = router;




const router = require("express").Router();
const Supplier = require("../models/supplier");
const SupplierSummary = require("../models/supplierSummary");


// Create a new supplier (POST)
router.route("/add").post(async (req, res) => {
    try {
        const { supplier_id, supplier_name, contact, credits, supplyCategory } = req.body;
        if (!supplier_id || !supplier_name || !contact || credits === undefined || !supplyCategory) {
            return res.status(400).json({ error: "All fields, including supplyCategory, are required" });
        }

        const newSupplier = new Supplier({
            supplier_id: Number(supplier_id),
            supplier_name,
            contact,
            credits: Number(credits),
            supplyCategory,
        });

        await newSupplier.save();

        // Update monthly supplier summary
        const month = new Date().toISOString().slice(0, 7); // e.g., "2025-03"
        await SupplierSummary.findOneAndUpdate(
            { month },
            {
                $inc: { totalSuppliersAdded: 1 },
                $push: { suppliers: { supplierId: supplier_id, supplierName: supplier_name, addedDate: new Date() } },
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
    } catch (err) {
        console.error("Error adding supplier:", err);
        if (err.code === 11000) return res.status(409).json({ error: "Supplier ID already exists" });
        res.status(500).json({ error: err.message });
    }
});

// Get all suppliers (GET)
router.route("/get").get(async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (err) {
        console.error("Error fetching suppliers:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update a supplier by supplier_id (PUT)
router.route("/update/:supid").put(async (req, res) => {
    try {
        const supplierId = Number(req.params.supid); 
        const { supplier_name, contact, credits } = req.body;

      
        if (!supplier_name && !contact && credits === undefined) {
            return res.status(400).json({ error: "At least one field is required to update" });
        }

        const updateData = {};
        if (supplier_name) updateData.supplier_name = supplier_name;
        if (contact) updateData.contact = contact;
        if (credits !== undefined) updateData.credits = Number(credits);

        const updatedSupplier = await Supplier.findOneAndUpdate(
            { supplier_id: supplierId },
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier updated successfully", supplier: updatedSupplier });
    } catch (err) {
        console.error("Error updating supplier:", err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a supplier by supplier_id (DELETE)
router.route("/delete/:supid").delete(async (req, res) => {
    try {
        const supplierId = Number(req.params.supid); // Convert to Number

        const deletedSupplier = await Supplier.findOneAndDelete({ supplier_id: supplierId });

        if (!deletedSupplier) {
            return res.status(404).json({ error: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (err) {
        console.error("Error deleting supplier:", err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;