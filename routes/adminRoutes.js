const express = require("express");
const AdminController = require("../controllers/AdminController");
const { verifyToken } = require("../services/jwt");

const router = express.Router();

router.get("/get", verifyToken, AdminController.getUser);
router.put("/update", verifyToken, AdminController.updateUser);
router.put("/avatar", verifyToken, AdminController.updateAvatar);

// Management Routes
router.get("/bookings", verifyToken, AdminController.getAllBookings);
router.post("/flights/add", verifyToken, AdminController.addFlight);
router.post("/hotels/add", verifyToken, AdminController.addHotel);
router.post("/buses/add", verifyToken, AdminController.addBus);

module.exports = adminRoutes = router;