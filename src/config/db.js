const mongoose = require("mongoose");

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // wait 5 sec
      });

      console.log("✅ MongoDB Connected");
      return;
    } catch (error) {
      retries++;
      console.log(
        `❌ MongoDB connection failed (attempt ${retries})`
      );
      console.log(error.message);

      if (retries === MAX_RETRIES) {
        console.log("🚨 MongoDB not reachable. Exiting...");
        process.exit(1);
      }

      // wait before retry
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

module.exports = connectDB;
