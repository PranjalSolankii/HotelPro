const router = require("express").Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/rooms?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&type=Deluxe
router.get("/", async (req, res) => {
  try {
    const { checkIn, checkOut, type } = req.query;
    const filter = { available: true };
    if (type) filter.type = type;
    let rooms = await Room.find(filter).sort("pricePerNight");

    if (checkIn && checkOut) {
      const busy = await Booking.find({
        status: { $in: ["confirmed", "checked-in"] },
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      }).distinct("room");
      const busySet = new Set(busy.map(String));
      rooms = rooms.filter((r) => !busySet.has(String(r._id)));
    }
    res.json(rooms);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Room.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
