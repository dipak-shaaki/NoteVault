const Note = require('../models/Note');

exports.addCollaborator = async (req, res) => {
  const { id } = req.params;
  const { collaboratorId } = req.body;
  console.log('req.body:', req.body);

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only owner can add collaborators' });
    }

    if (!note.collaborators.includes(collaboratorId)) {
      note.collaborators.push(collaboratorId);
      await note.save();
    }

    res.json({ msg: 'Collaborator added', collaborators: note.collaborators });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
