const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

router.use(authMiddleware);
router.use(adminOnly);

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
