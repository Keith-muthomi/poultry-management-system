const express = require('express');
const router = express.Router();
const ProductionController = require('../controllers/productionController');

// GET /api/production - Get all production logs
router.get('/', ProductionController.getProductionLogs);

// GET /api/production/today - Get today's overview stats
router.get('/today', ProductionController.getTodayStats);

// POST /api/production - Record new production log
router.post('/', ProductionController.createLog);

// DELETE /api/production/:id - Delete a log
router.delete('/:id', ProductionController.deleteLog);

module.exports = router;
