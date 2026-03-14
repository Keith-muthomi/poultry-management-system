const express = require('express');
const router = express.Router();
const FlockController = require('../controllers/flockController');

// GET /api/flocks - Get all flocks
router.get('/', FlockController.getFlocks);

// GET /api/flocks/:id - Get a specific flock
router.get('/:id', FlockController.getFlock);

// POST /api/flocks - Create a new flock
router.post('/', FlockController.createFlock);

// PUT /api/flocks/:id - Update a flock
router.put('/:id', FlockController.updateFlock);

// DELETE /api/flocks/:id - Delete a flock
router.delete('/:id', FlockController.deleteFlock);

module.exports = router;
