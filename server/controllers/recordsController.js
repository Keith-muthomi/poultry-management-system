const RecordsModel = require('../models/recordsModel');

const RecordsController = {
  // Check what supplies we have left (like feed and medicine)
  getSupplies: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const supplies = RecordsModel.getAllSupplies(farmId);
      res.json(supplies);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch supplies', details: err.message });
    }
  },

  // Record that we bought or got some new supplies
  createSupply: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    const userId = req.headers['x-user-id'];
    try {
      const result = RecordsModel.createSupply({ ...req.body, user_id: userId }, farmId);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Supply record created' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to create supply record', details: err.message });
    }
  },

  // Update how much of a supply we have left
  updateSupply: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = RecordsModel.updateSupply(req.params.id, req.body, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Supply not found or unauthorized' });
      res.json({ message: 'Supply updated' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update supply record', details: err.message });
    }
  },

  // Throw away a supply record
  deleteSupply: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = RecordsModel.deleteSupply(req.params.id, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Supply not found or unauthorized' });
      res.json({ message: 'Supply deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete supply record', details: err.message });
    }
  },

  // A generic way to get records from any table - pretty handy!
  getTableRecords: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    const { table } = req.params;
    const allowedTables = ['flocks', 'production', 'finance', 'supplies', 'protocols'];
    
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table requested' });
    }

    try {
      const db = require('../db/database');
      const records = db.prepare(`SELECT * FROM ${table} WHERE farm_id = ?`).all(farmId);
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: `Failed to fetch records from ${table}`, details: err.message });
    }
  }
};

module.exports = RecordsController;
