const express = require('express');
const router = express.Router();
const FinanceController = require('../controllers/financeController');

router.get('/', FinanceController.getAllTransactions);
router.get('/summary', FinanceController.getSummary);
router.post('/', FinanceController.createTransaction);
router.put('/:id', FinanceController.updateTransaction);
router.delete('/:id', FinanceController.deleteTransaction);

module.exports = router;
