const User = require('../models/User');
const Pending = require('../models/PendingVerification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/mailer');
const PasswordReset = require('../models/PasswordReset');

exports.register = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ msg: 'Email or username already exists' });

        const pending = await Pending.findOne({ email });

        if (pending) {
            if (pending.expiresAt < new Date()) {
                // Expired OTP → clear old pending record
                await Pending.deleteOne({ email });
            } else {
                return res.status(400).json({ msg: 'Verification already in progress' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        await Pending.create({ email, username, password: hashedPassword, otp, expiresAt });
        await sendOtpEmail(email, otp);

        res.json({ msg: 'OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const record = await Pending.findOne({ email });
        if (!record) return res.status(400).json({ msg: 'No pending verification found' });

        if (record.expiresAt < new Date()) {
            await Pending.deleteOne({ email });
            return res.status(400).json({ msg: 'OTP expired, please register again' });
        }

        if (record.otp !== otp)
            return res.status(400).json({ msg: 'Invalid OTP' });

        const newUser = new User({
            email: record.email,
            username: record.username,
            password: record.password,
        });
        await newUser.save();
        await Pending.deleteOne({ email });

        res.json({ msg: 'Account verified and created successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid username or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            msg: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// FORGOT PASSWORD

exports.forgotPassword = async (req, res) => {
    const { emailOrUsername } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!user) return res.status(404).json({ msg: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

        await PasswordReset.findOneAndUpdate(
            { email: user.email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        await sendOtpEmail(user.email, otp);

        res.json({ msg: 'OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// RESET PASSWORD WITH OTP
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const resetRecord = await PasswordReset.findOne({ email });

        if (!resetRecord) return res.status(400).json({ msg: 'No reset request found' });
        if (resetRecord.expiresAt < new Date()) return res.status(400).json({ msg: 'OTP expired' });
        if (resetRecord.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        await PasswordReset.deleteOne({ email });

        res.json({ msg: 'Password has been reset successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// CHANGE PASSWORD (LOGGED IN)
// ... other imports and code unchanged

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ msg: 'Both oldPassword and newPassword are required' });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'Not authenticated or invalid token' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Old password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

//Change username

exports.changeUsername = async (req, res) => {
    const { newUsername } = req.body;

    try {
        if (!newUsername) {
            return res.status(400).json({ msg: 'New username is required' });
        }

        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.username = newUsername;
        await user.save();

        res.json({ msg: 'Username updated successfully', username: user.username });
    } catch (err) {
        console.error('Change username error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};


//update user profile

exports.updateProfile = async (req, res) => {
    const { bio, avatarUrl } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (bio !== undefined) user.bio = bio;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        await user.save();

        res.json({
            msg: 'Profile updated successfully',
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

