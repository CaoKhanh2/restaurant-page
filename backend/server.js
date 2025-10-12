/* MODIFIED: The entire file has been restructured for clarity and to fix the MIME type error. */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Route Handling ---

// 1. API Routes: Handle all API calls first.
// Any request starting with /api will be handled here.
app.use('/api', bookingRoutes);

// 2. Static Assets: Serve all static files (CSS, JS, images) from the project root.
// This is the key fix: It ensures that requests for files like dashboard.css are found correctly.
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// 3. Page Serving Routes: Explicitly serve the HTML pages for the dashboard.
// This tells the server exactly which HTML file to send for each dashboard URL.
app.get('/dash', (req, res) => {
    res.sendFile(path.join(projectRoot, 'dash', 'index.html'));
});

app.get('/dash/bookings', (req, res) => {
    res.sendFile(path.join(projectRoot, 'dash', 'bookings', 'index.html'));
});

// --- Database Connection & Server Start ---
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.error('MongoDB connection error: MONGODB_URI is not defined in the .env file.');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the main site at: http://localhost:${PORT}`);
    console.log(`Access the dashboard at: http://localhost:${PORT}/dash/`);
  });
};

startServer();