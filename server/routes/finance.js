const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/financeController');

router.get('/', FinanceController.getFinanceRecords);
router.post('/', FinanceController.createFinanceRecord);
router.put('/:id', FinanceController.updateFinanceRecord);
router.delete('/:id', FinanceController.deleteFinanceRecord);

module.exports = router;
