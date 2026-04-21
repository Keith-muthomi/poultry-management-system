// Keeping track of egg production and feed
const express = require('express');
const router = express.Router();
const ProductionController = require('../controllers/productionController');

// Let's see how many eggs we've been getting
router.get('/', ProductionController.getAllProduction);

// Quick check on today's egg count
router.get('/today', ProductionController.getTodayStats);

// Check out a single egg record
router.get('/:id', ProductionController.getProductionById);

// Log the eggs for today
router.post('/', ProductionController.createProduction);

// Oops, fix a mistake in the records
router.put('/:id', ProductionController.updateProduction);

// Get rid of a record we don't want
router.delete('/:id', ProductionController.deleteProduction);

module.exports = router;
