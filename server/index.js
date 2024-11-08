import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';

dotenv.config();

const app = express();
app.use(express.json()); // Parses JSON bodies in requests
app.use(cors()); // Enables cross-origin requests

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);          // This includes both login and register routes
app.use('/api/employees', employeeRoutes); // Employee management routes
app.use('/uploads', express.static('uploads')); // Serve uploaded images'));


// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
