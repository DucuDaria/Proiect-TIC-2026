const express = require('express');
const destinationController = require('../controllers/destinationController');
const router = express.Router();
router.route('/')
  .get(destinationController.getAllDestinations)
  .post(destinationController.createDestination);

module.exports = router;