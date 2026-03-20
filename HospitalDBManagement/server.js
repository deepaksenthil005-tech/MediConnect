const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const patientAuthRoutes = require('./routes/patientAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const generalRoutes = require('./routes/generalRoutes');

app.use('/api/patient', patientAuthRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', generalRoutes);
app.get('/api/test', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://thalapathydeepak007_db_user:deepak123@cluster0.vk882zc.mongodb.net/mediconnect?appName=Cluster0';
mongoose.connect(mongoURI).then(() => {
  console.log('Connected to MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});
