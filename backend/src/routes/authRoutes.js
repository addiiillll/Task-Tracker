const express = require('express');
const router = express.Router();
const { 
  register,
  login,
  setCookie, 
  validateToken, 
  logout, 
  refreshToken, 
  getCurrentUser 
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Basic JWT auth endpoints
router.post('/register', register);
router.post('/login', login);

/**
 * @route   POST /api/auth/set-cookie
 * @desc    Set httpOnly cookie with JWT token
 * @access  Public (but requires valid token in body)
 * @body    { token: "jwt_token_string" }
 */
router.post('/set-cookie', setCookie);

/**
 * @route   GET /api/auth/validate
 * @desc    Validate httpOnly cookie token and return user info
 * @access  Private (requires httpOnly cookie or Authorization header)
 */
router.get('/validate', authMiddleware, validateToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear httpOnly cookie and logout user
 * @access  Private (requires httpOnly cookie or Authorization header)
 */
router.post('/logout', authMiddleware, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh token and extend session
 * @access  Private (requires httpOnly cookie or Authorization header)
 */
router.post('/refresh', authMiddleware, refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user information
 * @access  Private (requires httpOnly cookie or Authorization header)
 */
router.get('/me', authMiddleware, getCurrentUser);


module.exports = router;
