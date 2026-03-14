const FlockModel = require('../models/flockModel');

const FlockController = {
  getFlocks: (req, res) => {
    try {
      const flocks = FlockModel.getAll();
      res.json(flocks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch flocks', details: err.message });
    }
  },

  getFlock: (req, res) => {
    try {
      const flock = FlockModel.getById(req.params.id);
      if (!flock) return res.status(404).json({ error: 'Flock not found' });
      res.json(flock);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch flock', details: err.message });
    }
  },

  createFlock: (req, res) => {
    try {
      const result = FlockModel.create(req.body);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Flock created successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to create flock', details: err.message });
    }
  },

  updateFlock: (req, res) => {
    try {
      const result = FlockModel.update(req.params.id, req.body);
      if (result.changes === 0) return res.status(404).json({ error: 'Flock not found' });
      res.json({ message: 'Flock updated successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update flock', details: err.message });
    }
  },

  deleteFlock: (req, res) => {
    try {
      const result = FlockModel.delete(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: 'Flock not found' });
      res.json({ message: 'Flock deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete flock', details: err.message });
    }
  }
};

module.exports = FlockController;
