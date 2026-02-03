const express = require('express');
const {
  register,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const {
  authMiddleware,
  requireRole,
} = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  handleValidationErrors,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout);

// Protected routes (require authentication)
router.get('/me', authMiddleware, getCurrentUser);
router.put(
  '/profile',
  authMiddleware,
  validateUpdateProfile,
  handleValidationErrors,
  updateProfile
);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
