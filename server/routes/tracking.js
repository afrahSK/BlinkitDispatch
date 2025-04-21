const User = require('../models/User');

router.get('/track/:orderId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.address || !user.address.lat || !user.address.lng) {
      return res.status(404).json({ msg: "User address not found" });
    }

    const destination = {
      lat: user.address.lat,
      lng: user.address.lng
    };

    const route = [
      { lat: 23.0225, lng: 72.5714, status: "Dispatched", timestamp: "10:30 AM" },
      { lat: 23.0300, lng: 72.5800, status: "In Transit", timestamp: "10:45 AM" },
      { lat: 23.0350, lng: 72.5850, status: "Near Destination", timestamp: "11:00 AM" },
      { lat: destination.lat, lng: destination.lng, status: "Delivered", timestamp: "11:15 AM" }
    ];

    res.json({ orderId: req.params.orderId, route });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
