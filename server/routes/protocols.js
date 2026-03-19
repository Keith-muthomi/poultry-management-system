const express = require('express');
const router = express.Router();
const ProtocolController = require('../controllers/protocolController');

router.get('/', ProtocolController.getProtocols);
router.post('/', ProtocolController.createProtocol);
router.delete('/:id', ProtocolController.deleteProtocol);

module.exports = router;
