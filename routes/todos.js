const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/auth');

// GET /api/todos
router.get('/', protect, async (req, res) => {
  const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(todos);
});

// POST /api/todos
router.post('/', protect, async (req, res) => {
  try {
    const todo = await Todo.create({ user: req.user._id, text: req.body.text });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/todos/:id
router.patch('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    if (req.body.text !== undefined) todo.text = req.body.text;
    if (req.body.done !== undefined) todo.done = req.body.done;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/todos/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
