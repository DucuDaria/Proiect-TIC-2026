const express = require('express');
const adminController = require('../controllers/adminController');
const { validateToken } = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');

const router = express.Router();

router.use(validateToken);
router.use(checkAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/bookings', adminController.getAllBookings);
router.get('/users/:uid/bookings', adminController.getUserBookings);

module.exports = router;