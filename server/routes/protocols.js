// Routes for keeping track of what needs to be done on the farm
const express = require('express');
const router = express.Router();
const ProtocolController = require('../controllers/protocolController');

router.get('/', ProtocolController.getProtocols);
router.post('/', ProtocolController.createProtocol);
router.put('/:id', ProtocolController.updateProtocol);
router.delete('/:id', ProtocolController.deleteProtocol);

module.exports = router;
