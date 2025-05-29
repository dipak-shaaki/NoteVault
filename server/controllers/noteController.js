const Note = require('../models/Note');
const { encrypt, decrypt } = require('../utils/encryption');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags, isPublic, expiryDate } = req.body;
    const encryptedContent = encrypt(content);

    const newNote = await Note.create({
      userId: req.user.id, // ✅ make sure this matches schema
      title,
      content: encryptedContent,
      tags,
      isPublic,
      expiryDate,
    });

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all notes for user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, isDeleted: false });

    const decryptedNotes = notes.map(note => ({
      ...note.toObject(),
      content: decrypt(note.content),
    }));

    res.json(decryptedNotes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update a note by id
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

// Soft delete a note
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

