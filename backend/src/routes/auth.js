const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

// Public routes — no token needed
router.post('/register', register);
router.post('/login',    login);

// Protected routes — token required
router.get('/me',                auth, getMe);
router.put('/profile',           auth, updateProfile);    // Profile page → Save Changes
router.put('/change-password',   auth, changePassword);   // Profile page → Update Password

module.exports = router;