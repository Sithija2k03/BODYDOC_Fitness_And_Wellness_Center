const mongoose = require("mongoose");

async function dropOrderIdIndex() {
  try {
    // Connect to your MongoDB database
    await mongoose.connect("mongodb+srv://Sithija:mxz4r55Z37HZp32S@clustertest.fvsuy.mongodb.net/fitnessDB?retryWrites=true&w=majority&appName=ClusterTest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log("Connected to MongoDB");

    // Define a temporary model for the orders collection
    const Order = mongoose.model("Order", new mongoose.Schema({}), "orders");

    // List current indexes
    const indexes = await Order.collection.indexes();
    console.log("Current indexes:", indexes);

    // Drop the order_id_1 index
    await Order.collection.dropIndex("appoinment_id_1");
    console.log("Dropped appoinment_id_1 index");

    // Verify remaining indexes
    const updatedIndexes = await Order.collection.indexes();
    console.log("Remaining indexes:", updatedIndexes);

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

dropOrderIdIndex();