const express = require('express');
const router = express.Router();
const RecordsController = require('../controllers/recordsController');

router.get('/:table', RecordsController.getTableRecords);

module.exports = router;
