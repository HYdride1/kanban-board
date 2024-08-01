const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  content: { type: String, required: true },
  columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
});

module.exports = mongoose.model('Task', taskSchema);
