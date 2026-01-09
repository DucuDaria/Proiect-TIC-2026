const express = require('express');
const destinationController = require('../controllers/destinationController');
const { validateToken } = require('../middleware/auth');

const router = express.Router();
router.get('/my-vacations', validateToken, destinationController.getMyDestinations);
router.route('/')
  .get(destinationController.getAllDestinations) 
  .post(validateToken, destinationController.createDestination); 
router.route('/:id')
  .get(destinationController.getDestinationById);

module.exports = router;