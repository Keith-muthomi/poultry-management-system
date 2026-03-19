const FinanceModel = require('../models/financeModel');

const FinanceController = {
  getFinanceRecords: (req, res) => {
    try {
      const records = FinanceModel.getAll();
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch finance records', details: err.message });
    }
  },

  createFinanceRecord: (req, res) => {
    try {
      const result = FinanceModel.create(req.body);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Finance record created successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to create finance record', details: err.message });
    }
  },

  updateFinanceRecord: (req, res) => {
    try {
      const result = FinanceModel.update(req.params.id, req.body);
      if (result.changes === 0) return res.status(404).json({ error: 'Record not found' });
      res.json({ message: 'Finance record updated successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update finance record', details: err.message });
    }
  },

  deleteFinanceRecord: (req, res) => {
    try {
      const result = FinanceModel.delete(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: 'Record not found' });
      res.json({ message: 'Finance record deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete finance record', details: err.message });
    }
  }
};

module.exports = FinanceController;
