const express = require('express');
const router = express.Router();
const { register, verifyOtp, login,forgotPassword, resetPassword, changePassword  } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmiddleware');
const authController = require('../controllers/authController');


router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protect change-password route
router.post('/change-password', authMiddleware, authController.changePassword);


router.use(authMiddleware);

router.patch('/change-username', authController.changeUsername);
router.patch('/update-profile', authController.updateProfile);



module.exports = router;