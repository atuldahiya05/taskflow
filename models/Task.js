const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deadline: { type: Date },
  status: { type: String, enum: ['pending', 'completed', 'deleted'], default: 'pending' },
  type: { type: String, enum: ['assigned', 'request'], default: 'assigned' },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
