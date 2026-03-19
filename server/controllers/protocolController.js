const ProtocolModel = require('../models/protocolModel');

const ProtocolController = {
  getProtocols: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const protocols = ProtocolModel.getAll(farmId);
      res.json(protocols);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch protocols', details: err.message });
    }
  },

  createProtocol: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    const userId = req.headers['x-user-id'];
    try {
      const result = ProtocolModel.create({ ...req.body, user_id: userId }, farmId);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Protocol created' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to create protocol', details: err.message });
    }
  },

  updateProtocol: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = ProtocolModel.update(req.params.id, req.body, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Protocol not found or unauthorized' });
      res.json({ message: 'Protocol updated' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update protocol', details: err.message });
    }
  },

  deleteProtocol: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = ProtocolModel.delete(req.params.id, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Protocol not found or unauthorized' });
      res.json({ message: 'Protocol deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete protocol', details: err.message });
    }
  }
};

module.exports = ProtocolController;
