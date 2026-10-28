const router = require("express").Router();
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const { protect, adminOnly } = require("../middleware/auth");

// Create booking (with overlap check + mock payment)
router.post("/", protect, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;
    const inD = new Date(checkIn), outD = new Date(checkOut);
    if (isNaN(inD) || isNaN(outD) || outD <= inD)
      return res.status(400).json({ message: "Check-out must be after check-in" });

    const room = await Room.findById(roomId);
    if (!room || !room.available) return res.status(404).json({ message: "Room not available" });
    if (guests > room.capacity) return res.status(400).json({ message: `Room sleeps ${room.capacity} guests at most` });

    const clash = await Booking.findOne({
      room: roomId,
      status: { $in: ["confirmed", "checked-in"] },
      checkIn: { $lt: outD },
      checkOut: { $gt: inD },
    });
    if (clash) return res.status(409).json({ message: "Room is already booked for those dates" });

    const nights = Math.ceil((outD - inD) / 86400000);
    const booking = await Booking.create({
      user: req.user._id, room: roomId, checkIn: inD, checkOut: outD,
      guests, totalPrice: nights * room.pricePerNight, paymentStatus: "paid", // mock payment
    });
    res.status(201).json(await booking.populate("room"));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/mine", protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("room").sort("-createdAt");
  res.json(bookings);
});

router.put("/:id/cancel", protect, async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Booking not found" });
  if (String(b.user) !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ message: "Not allowed" });
  b.status = "cancelled";
  await b.save();
  res.json(b);
});

// Admin
router.get("/", protect, adminOnly, async (req, res) => {
  const bookings = await Booking.find().populate("room").populate("user", "name email").sort("-createdAt");
  res.json(bookings);
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const b = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(b);
});

module.exports = router;
