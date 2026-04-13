const mongoose = require("mongoose");

const connectDB = async () => {
  const atlasUrl = process.env.MONGO_URL;
  const localUrl = "mongodb://127.0.0.1:27017/yatralo";

  try {
    // Attempt Alpha Connection (Atlas)
    console.log("🚀 Initializing Atlas connectivity manifest...");
    await mongoose.connect(atlasUrl);
    console.log("✅ Registry Synchronized: MongoDB Atlas Connected");
  } catch (error) {
    console.error("⚠️ Atlas Connection Refused:", error.message);
    console.log("🔄 Pivoting to Local Registry: mongodb://127.0.0.1:27017/yatralo");
    
    try {
      // Attempt Beta Connection (Local)
      await mongoose.connect(localUrl);
      console.log("✅ Local Registry Active: Database Synchronized (Offline/Local Mode)");
    } catch (fallbackError) {
      console.error("❌ High-Integrity Failure: All database manifests unreachable");
      process.exit(1);
    }
  }

  mongoose.connection.on("error", (err) => {
    console.error("⚡ Terminal Connectivity Error:", err);
  });
};

module.exports = connectDB;