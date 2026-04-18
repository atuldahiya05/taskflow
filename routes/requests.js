const express = require('express');
const router = express.Router();
const TaskRequest = require('../models/TaskRequest');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// GET /api/requests/sent
router.get('/sent', protect, async (req, res) => {
  const reqs = await TaskRequest.find({ from: req.user._id })
    .populate('to', 'name email').sort({ createdAt: -1 });
  res.json(reqs);
});

// GET /api/requests/received
router.get('/received', protect, async (req, res) => {
  const reqs = await TaskRequest.find({ to: req.user._id, status: 'pending' })
    .populate('from', 'name email').sort({ createdAt: -1 });
  res.json(reqs);
});

// POST /api/requests
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, to, deadline } = req.body;
    if (to === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    const request = await TaskRequest.create({
      title, description, from: req.user._id, to, deadline,
    });
    const populated = await request.populate(['from', 'to']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/requests/:id/accept
router.patch('/:id/accept', protect, async (req, res) => {
  try {
    const request = await TaskRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.to.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your request' });
    request.status = 'accepted';
    await request.save();
    // Create a real task for the recipient
    await Task.create({
      title: request.title,
      description: request.description,
      assignedTo: request.to,
      assignedBy: request.from,
      deadline: request.deadline,
      type: 'request',
    });
    res.json({ message: 'Request accepted, task created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/requests/:id/reject
router.patch('/:id/reject', protect, async (req, res) => {
  try {
    const request = await TaskRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.to.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your request' });
    request.status = 'rejected';
    await request.save();
    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
