const express = require('express');
const router = express.Router();
const { 
  register,
  login,
  logout, 
  validateToken, 
  getCurrentUser 
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/validate', authMiddleware, validateToken);
router.get('/me', authMiddleware, getCurrentUser);


module.exports = router;
