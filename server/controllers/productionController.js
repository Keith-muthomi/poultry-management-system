const ProductionModel = require('../models/productionModel');

const ProductionController = {
  getProductionLogs: (req, res) => {
    try {
      const logs = ProductionModel.getAll();
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch logs', details: err.message });
    }
  },

  getTodayStats: (req, res) => {
    try {
      const stats = ProductionModel.getTodayStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
    }
  },

  createLog: (req, res) => {
    try {
      const result = ProductionModel.create(req.body);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Production log recorded' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to record log', details: err.message });
    }
  },

  deleteLog: (req, res) => {
    try {
      const result = ProductionModel.delete(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: 'Log not found' });
      res.json({ message: 'Log deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete log', details: err.message });
    }
  }
};

module.exports = ProductionController;
