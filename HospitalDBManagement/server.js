const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/**
 * MIDDLEWARE CONFIGURATION
 * - cors(): Enables Cross-Origin Resource Sharing for frontend integration
 * - express.json(): Parses incoming JSON payloads
 * - express.urlencoded(): Parses URL-encoded data
 */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * ROUTE IMPORTS
 */
const patientAuthRoutes = require('./routes/patientAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const generalRoutes = require('./routes/generalRoutes');

/**
 * API ENDPOINTS
 */
// Authentication routes
app.use('/api/patient', patientAuthRoutes);
app.use('/api/admin', adminAuthRoutes);

// Resource routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes); // Mount appointments separately for better organization
app.use('/api', generalRoutes); // General routes for stats, feedback, reports, etc.

/**
 * TEST & DEBUG ENDPOINTS
 */
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.1.0', 
    time: new Date().toISOString(),
    message: 'Hospital Management API is running'
  });
});

/**
 * GLOBAL ERROR HANDLER
 * Catches all unhandled errors and returns a formatted JSON response
 */
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

/**
 * DATABASE CONNECTION & SERVER START
 */
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://thalapathydeepak007_db_user:deepak123@cluster0.vk882zc.mongodb.net/mediconnect?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit process if DB connection fails
  });

