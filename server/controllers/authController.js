const User = require('../models/User');
const Pending = require('../models/PendingVerification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/mailer');

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
