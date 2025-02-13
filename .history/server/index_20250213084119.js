import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './User.model.js'
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// User registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User login route
// User login route (modified)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log(`Username: ${username}, Password: ${password}`);  // Log the received data
        return res.json({
            message: 'Login successful',
            user: {
                username,
                password
            }
        });
    } catch (error) {
        console.error('Login error:', error);  // Log the full error
        res.status(500).json({ message: 'Error logging in', error: error.message || error });
    }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
