const mongoose = require('mongoose');
const Helth = require('./models/helth.js');

async function cleanHelthDocuments() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await Helth.updateMany(
      { workoutPlan: { $exists: true } },
      { $unset: { workoutPlan: "" } }
    );
    console.log('Workout plan field removed from Helth documents');
  } catch (error) {
    console.error('Migration error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

cleanHelthDocuments();