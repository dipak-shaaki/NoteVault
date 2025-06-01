const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');



const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 
// Allow CORS from the frontend URL
app.use(express.json());




mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
