// Everything to do with logging in and making sure users are who they say they are
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/verify-admin', AuthController.verifyAdminSecondary);
router.post('/update-profile', AuthController.updateProfile);
router.post('/update-password', AuthController.updatePassword);

module.exports = router;
