const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
