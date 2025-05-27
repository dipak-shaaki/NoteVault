const mongoose = require('mongoose');

const pendingSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('PendingVerification', pendingSchema);
