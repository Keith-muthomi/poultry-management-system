// All about the supplies and stock records
const express = require('express');
const router = express.Router();
const RecordsController = require('../controllers/recordsController');

router.get('/supplies', RecordsController.getSupplies);
router.get('/table/:table', RecordsController.getTableRecords);
router.post('/supplies', RecordsController.createSupply);
router.put('/supplies/:id', RecordsController.updateSupply);
router.delete('/supplies/:id', RecordsController.deleteSupply);

module.exports = router;
