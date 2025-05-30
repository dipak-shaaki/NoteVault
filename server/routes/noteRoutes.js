const express = require('express');
const router = express.Router();
const { createNote, getNotes, updateNote, deleteNote ,getTrash,restoreNote,permanentDeleteNote,searchNotes,getPublicNote} = require('../controllers/noteController');
const authMiddleware = require('../middleware/authmiddleware');
const {addCollaborator} = require('../controllers/addCollaborator');

router.use(authMiddleware);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/search', searchNotes); 
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

router.get('/trash', getTrash); //  list trashed
router.put('/restore/:id', restoreNote); // restore trashed note
router.delete('/permanent/:id', permanentDeleteNote); // hard delete
router.get('/public/:id', getPublicNote);
router.post('/:id/collaborators', authMiddleware, addCollaborator);



module.exports = router;