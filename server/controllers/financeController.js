const FinanceModel = require('../models/financeModel');

const FinanceController = {
  // See all the money we've spent or earned
  getAllTransactions: (req, res) => {
    const farmId = req.headers['x-farm-id'];
    try {
      const transactions = FinanceModel.getAll(farmId);
      res.json(transactions);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch financial records', details: err.message });
    }
  },

  // Record a new sale or an expense
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

  // Fix a mistake in a transaction
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

  // Delete a transaction we don't need anymore
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

  // Get a quick look at our total income and expenses
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
