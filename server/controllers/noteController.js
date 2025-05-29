const Note = require('../models/Note');
const { encrypt, decrypt } = require('../utils/encryption');

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags, isPublic, expiryDate } = req.body;
    const encryptedContent = encrypt(content);

    const newNote = await Note.create({
      userId: req.user.id,
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
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    const isOwner = note.userId.toString() === req.user.id;
    const isCollaborator = note.collaborators.some(
      (collabId) => collabId.toString() === req.user.id
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    Object.assign(note, updates);
    await note.save();

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
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    const isOwner = note.userId.toString() === req.user.id;
    const isCollaborator = note.collaborators.some(
      (collabId) => collabId.toString() === req.user.id
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    note.isDeleted = true;
    await note.save();

    res.json({ msg: 'Note moved to trash' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getTrash = async (req, res) => {
  try {
    const trashedNotes = await Note.find({ userId: req.user.id, isDeleted: true });
    const decryptedNotes = trashedNotes.map(note => ({
      ...note.toObject(),
      content: decrypt(note.content),
    }));
    res.json(decryptedNotes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Restore note

exports.restoreNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || !note.isDeleted) {
      return res.status(404).json({ msg: 'Note not found or unauthorized' });
    }

    const isOwner = note.userId.toString() === req.user.id;
    const isCollaborator = note.collaborators.some(
      (collabId) => collabId.toString() === req.user.id
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    note.isDeleted = false;
    await note.save();

    res.json({ msg: 'Note restored', note });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//After putting the note in trash, you can permanently delete it

exports.permanentDeleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || !note.isDeleted) {
      return res.status(404).json({ msg: 'Note not found or unauthorized' });
    }

    const isOwner = note.userId.toString() === req.user.id;
    const isCollaborator = note.collaborators.some(
      (collabId) => collabId.toString() === req.user.id
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Note.deleteOne({ _id: req.params.id });

    res.json({ msg: 'Note permanently deleted' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.searchNotes = async (req, res) => {
  try {
    const { title, tags, isPublic, startDate, endDate } = req.query;

    const filter = { isDeleted: false };

    // User should only see own notes + public notes if filtering is by public
    if (isPublic === 'true') {
      filter.isPublic = true;
    } else if (isPublic === 'false') {
      // Only private notes by this user
      filter.isPublic = false;
      filter.userId = req.user.id;
    } else {
      // If no isPublic filter, user can see own notes and public notes
      filter.$or = [
        { userId: req.user.id },
        { isPublic: true },
      ];
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (tags) {
      // Split comma separated tags and match if any of the tags match (using $in)
      const tagsArray = tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagsArray };
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const notes = await Note.find(filter);

    const decryptedNotes = notes.map(note => ({
      ...note.toObject(),
      content: decrypt(note.content),
    }));

    res.json(decryptedNotes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// Get a public note by ID

exports.getPublicNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, isPublic: true, isDeleted: false });

    if (!note) {
      return res.status(404).json({ msg: 'Public note not found' });
    }

    res.json({
      title: note.title,
      content: decrypt(note.content),
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
