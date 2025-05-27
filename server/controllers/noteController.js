const Note = require('../models/Note');

// Create a new note
exports.createNote = async (req, res) => {
  const { title, content, tags, isPublic, expiryDate } = req.body;
  const userId = req.user.id; // We'll extract user from JWT middleware later

  try {
    const note = new Note({
      userId,
      title,
      content,
      tags,
      isPublic,
      expiryDate,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all notes for logged-in user (excluding deleted)
exports.getNotes = async (req, res) => {
  const userId = req.user.id;

  try {
    const notes = await Note.find({ userId, isDeleted: false });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a note by id (only if owned by user)
exports.updateNote = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const updates = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );
    if (!note) return res.status(404).json({ msg: 'Note not found or unauthorized' });

    res.json(note);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Soft delete a note (move to trash)
exports.deleteNote = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { isDeleted: true },
      { new: true }
    );
    if (!note) return res.status(404).json({ msg: 'Note not found or unauthorized' });

    res.json({ msg: 'Note moved to trash' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
