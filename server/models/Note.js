const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    content: String,
    tags: [String],
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Note', noteSchema);
