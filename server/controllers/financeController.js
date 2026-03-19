const FinanceModel = require('../models/financeModel');

const FinanceController = {
  getAllTransactions: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const transactions = FinanceModel.getAll(farmId);
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch financial records', details: err.message });
    }
  },

  createTransaction: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    const userId = req.headers['x-user-id'];
    try {
      const result = FinanceModel.create({ ...req.body, user_id: userId }, farmId);
      res.status(201).json({ id: result.lastInsertRowid, message: 'Transaction created successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to create transaction', details: err.message });
    }
  },

  updateTransaction: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = FinanceModel.update(req.params.id, req.body, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Transaction not found or unauthorized' });
      res.json({ message: 'Transaction updated successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update transaction', details: err.message });
    }
  },

  deleteTransaction: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const result = FinanceModel.delete(req.params.id, farmId);
      if (result.changes === 0) return res.status(404).json({ error: 'Transaction not found or unauthorized' });
      res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete transaction', details: err.message });
    }
  },

  getSummary: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const summary = FinanceModel.getSummary(farmId);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch financial summary', details: err.message });
    }
  }
};

module.exports = FinanceController;
