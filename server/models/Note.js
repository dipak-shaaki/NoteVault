const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  content: String,
  tags: [String],
  isPublic: Boolean,
  expiryDate: Date,
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// Update updatedAt on save
noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);