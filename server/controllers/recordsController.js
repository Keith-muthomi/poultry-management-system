const RecordsModel = require('../models/recordsModel');

const RecordsController = {
  getTableRecords: (req, res) => {
    try {
      const { table } = req.params;
      const records = RecordsModel.getTableData(table);
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: `Failed to fetch records for ${req.params.table}`, details: err.message });
    }
  }
};

module.exports = RecordsController;
