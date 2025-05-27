const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner of the note
  title: { type: String, required: true },
  content: { type: String, required: true }, // We'll encrypt this later
  tags: [String],
  isPublic: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }, // For trash bin (soft delete)
  expiryDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
