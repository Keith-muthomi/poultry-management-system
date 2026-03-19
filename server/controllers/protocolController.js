const ProtocolModel = require('../models/protocolModel');

const ProtocolController = {
  getProtocols: (req, res) => {
    try {
      const protocols = ProtocolModel.getAll();
      res.json(protocols);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch protocols', details: err.message });
    }
  },

  createProtocol: (req, res) => {
    try {
      const result = ProtocolModel.create(req.body);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Protocol added' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to add protocol', details: err.message });
    }
  },

  deleteProtocol: (req, res) => {
    try {
      const result = ProtocolModel.delete(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: 'Protocol not found' });
      res.json({ message: 'Protocol removed' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove protocol', details: err.message });
    }
  }
};

module.exports = ProtocolController;
