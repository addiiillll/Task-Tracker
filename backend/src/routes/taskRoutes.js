const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require('../controllers/taskController');

// Protect all task routes
router.use(authMiddleware);

// CRUD and filter
router.get('/', getTasks); // GET /api/tasks?status=all|completed|pending
router.post('/', createTask); // POST /api/tasks
router.put('/:id', updateTask); // PUT /api/tasks/:id
router.patch('/:id/toggle', toggleTask); // PATCH /api/tasks/:id/toggle
router.delete('/:id', deleteTask); // DELETE /api/tasks/:id

module.exports = router;