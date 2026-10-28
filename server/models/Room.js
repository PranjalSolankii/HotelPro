const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Single", "Double", "Deluxe", "Suite"], required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    capacity: { type: Number, default: 2 },
    amenities: [String],
    description: String,
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
