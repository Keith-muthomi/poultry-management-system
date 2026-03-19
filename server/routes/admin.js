const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');

router.get('/users', AdminController.getAllUsers);
router.post('/users/:id/status', AdminController.updateUserStatus);
router.delete('/users/:id', AdminController.deleteUser);
router.get('/export', AdminController.getSystemData);

module.exports = router;
