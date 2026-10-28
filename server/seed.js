// Run once:  npm run seed   (creates an admin + sample rooms)
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Room = require("./models/Room");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Room.deleteMany();
  await Room.insertMany([
    { number: "101", type: "Single", pricePerNight: 1800, capacity: 1, amenities: ["WiFi", "AC", "TV"], description: "Compact room for solo travellers." },
    { number: "102", type: "Double", pricePerNight: 2800, capacity: 2, amenities: ["WiFi", "AC", "TV", "Breakfast"], description: "Queen bed with a work desk." },
    { number: "201", type: "Deluxe", pricePerNight: 4200, capacity: 3, amenities: ["WiFi", "AC", "Balcony", "Breakfast"], description: "Spacious room with a garden-facing balcony." },
    { number: "301", type: "Suite", pricePerNight: 7500, capacity: 4, amenities: ["WiFi", "AC", "Living area", "Bathtub", "Breakfast"], description: "Two-room suite with a separate lounge." },
  ]);
  if (!(await User.findOne({ email: "admin@hotelpro.com" })))
    await User.create({ name: "Admin", email: "admin@hotelpro.com", password: "admin123", role: "admin" });
  console.log("Seeded. Admin login: admin@hotelpro.com / admin123 (change it!)");
  process.exit(0);
})();
