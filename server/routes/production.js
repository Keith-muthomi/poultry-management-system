const express = require('express');
const router = express.Router();
const ProductionController = require('../controllers/productionController');

// GET /api/production - Get all production logs
router.get('/', ProductionController.getAllProduction);

// GET /api/production/today - Get today's overview stats
router.get('/today', ProductionController.getTodayStats);

// GET /api/production/:id - Get specific log
router.get('/:id', ProductionController.getProductionById);

// POST /api/production - Record new production log
router.post('/', ProductionController.createProduction);

// PUT /api/production/:id - Update a log
router.put('/:id', ProductionController.updateProduction);

// DELETE /api/production/:id - Delete a log
router.delete('/:id', ProductionController.deleteProduction);

module.exports = router;
