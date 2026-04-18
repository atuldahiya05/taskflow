const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, managerOnly } = require('../middleware/auth');

// GET /api/tasks  — manager sees all, employee sees own
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'manager' ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks  — manager assigns task to employee
router.post('/', protect, managerOnly, async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;
    const task = await Task.create({
      title, description, assignedTo,
      assignedBy: req.user._id,
      deadline, type: 'assigned',
    });
    const populated = await task.populate(['assignedTo', 'assignedBy']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.assignedTo.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your task' });
    task.status = 'completed';
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/delete
router.patch('/:id/delete', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const isOwner = task.assignedTo.toString() === req.user._id.toString();
    const isManager = req.user.role === 'manager';
    if (!isOwner && !isManager) return res.status(403).json({ message: 'Access denied' });
    task.status = 'deleted';
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
