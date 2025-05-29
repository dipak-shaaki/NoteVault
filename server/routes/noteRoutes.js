const express = require('express');
const router = express.Router();
const { createNote, getNotes, updateNote, deleteNote ,getTrash,restoreNote,permanentDeleteNote,searchNotes} = require('../controllers/noteController');
const authMiddleware = require('../middleware/authmiddleware');

router.use(authMiddleware);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/search', searchNotes); 
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

router.get('/trash', getTrash); //  list trashed
router.put('/restore/:id', restoreNote); // restore trashed note
router.delete('/permanent/:id', permanentDeleteNote); // hard delete

module.exports = router;