// This is for managing our flocks of birds
const express = require('express');
const router = express.Router();
const FlockController = require('../controllers/flockController');

// Grab all the birds we have
router.get('/', FlockController.getFlocks);

// Get just one flock if you have its ID
router.get('/:id', FlockController.getFlock);

// Add some new birds to the farm
router.post('/', FlockController.createFlock);

// Update info when things change for a flock
router.put('/:id', FlockController.updateFlock);

// Delete a flock if it's not here anymore
router.delete('/:id', FlockController.deleteFlock);

module.exports = router;
