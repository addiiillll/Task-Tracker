const { prisma } = require('../config/db');

// GET /tasks – Get all tasks (with optional status filter)
const getTasks = async (req, res) => {
  try {
    const { status } = req.query; // all | completed | pending
    const where = {}; // no owner filter

    if (status === 'completed') where.completed = true;
    if (status === 'pending') where.completed = false;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        owner: {
          select: {
            name: true,
            email: true, // optional if you also want the email
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// POST /tasks – Add new task
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        ownerId: req.user.id,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /tasks/:id – Update a task (title, description, dueDate, completed)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;

    // Ensure task belongs to user
    const existing = await prisma.task.findFirst({ where: { id, ownerId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'This is not your task.' });

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existing.dueDate,
        completed: completed !== undefined ? completed : existing.completed,
      },
    });

    res.json(task);
  } catch (err) {
    console.error('updateTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /tasks/:id/toggle – toggle completed
const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.task.findFirst({ where: { id, ownerId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'This is not your task.' });

    const task = await prisma.task.update({
      where: { id },
      data: { completed: !existing.completed },
    });

    res.json(task);
  } catch (err) {
    console.error('toggleTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /tasks/:id – Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.task.findFirst({ where: { id, ownerId: req.user.id } });
    if (!existing) return res.status(404).json({ message: 'This is not your task.' });

    await prisma.task.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteTask error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask };