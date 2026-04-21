const ProductionModel = require('../models/productionModel');

const ProductionController = {
  // Get all the info about how many eggs we've been getting
  getAllProduction: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const records = ProductionModel.getAll(farmId);
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch production records', details: err.message });
    }
  },

  // How are we doing today? Let's check the numbers!
  getTodayStats: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const db = require('../db/database');
      const stats = db.prepare(`
        SELECT 
          SUM(egg_count) as total_eggs,
          SUM(mortality_count) as total_mortality,
          SUM(feed_consumed_kg) as total_feed
        FROM production 
        WHERE date = DATE('now') AND farm_id = ?
      `).get(farmId);
      res.json(stats || { total_eggs: 0, total_mortality: 0, total_feed: 0 });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch today stats', details: err.message });
    }
  },

  // Look up a specific production record
  getProductionById: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const record = ProductionModel.getById(req.params.id, farmId);
      if (!record) return res.status(404).json({ error: 'Record not found' });
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch production record', details: err.message });
    }
  },

  // Write down the numbers for today
  createProduction: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    const userId = req.headers['x-user-id'];
    try {
      const result = ProductionModel.create({ ...req.body, user_id: userId }, farmId);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Production record created successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to create production record', details: err.message });
    }
  },

  // Fix a typo in one of our records
  updateProduction: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = ProductionModel.update(req.params.id, req.body, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Record not found or unauthorized' });
      res.json({ message: 'Production record updated successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update production record', details: err.message });
    }
  },

  // Toss out a record we don't need
  deleteProduction: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = ProductionModel.delete(req.params.id, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Record not found or unauthorized' });
      res.json({ message: 'Production record deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete production record', details: err.message });
    }
  }
};

module.exports = ProductionController;
