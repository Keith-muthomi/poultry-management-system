const FlockModel = require('../models/flockModel');

const FlockController = {
  getFlocks: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const flocks = FlockModel.getAll(farmId);
      res.json(flocks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch flocks', details: err.message });
    }
  },

  getFlock: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const flock = FlockModel.getById(req.params.id, farmId);
      if (!flock) return res.status(404).json({ error: 'Flock not found' });
      res.json(flock);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch flock', details: err.message });
    }
  },

  createFlock: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    const userId = req.headers['x-user-id']; // Optional but good practice
    try {
      const result = FlockModel.create({ ...req.body, user_id: userId }, farmId);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Flock created successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to create flock', details: err.message });
    }
  },

  updateFlock: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = FlockModel.update(req.params.id, req.body, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Flock not found or unauthorized' });
      res.json({ message: 'Flock updated successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update flock', details: err.message });
    }
  },

  deleteFlock: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = FlockModel.delete(req.params.id, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Flock not found or unauthorized' });
      res.json({ message: 'Flock deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete flock', details: err.message });
    }
  }
};

module.exports = FlockController;
