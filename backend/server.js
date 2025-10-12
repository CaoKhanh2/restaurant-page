/* MODIFIED: Final and stable version using middleware for Socket.IO instance. */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for development
    }
}); 

const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// This middleware attaches the 'io' instance to every request object (req).
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- Route Handling ---
app.use('/api', bookingRoutes);
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
    console.log('✅ Real-time dashboard client connected.');
    socket.on('disconnect', () => {
        console.log('🔌 Dashboard client disconnected.');
    });
});

// --- Database Connection & Server Start ---
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
          console.error('MongoDB connection error: MONGODB_URI is not defined in the .env file.');
          process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB.');
      } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
      }
};

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the main site at: http://localhost:${PORT}`);
    console.log(`Access the dashboard at: http://localhost:${PORT}/dash/bookings/view-bookings.html`);
  });
};

startServer();