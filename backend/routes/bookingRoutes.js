/* MODIFIED: The file is updated to add new API endpoints for the dashboard. */
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// URL to create a new booking request.
router.post('/bookings', bookingController.createBooking);
    
// URL to check for available time slots.
router.get('/availability', bookingController.checkAvailability);

// --- DASHBOARD ROUTES ---

// MODIFIED: Add a new route to get all bookings.
// This route should be protected by authentication middleware in a real application.
router.get('/bookings', bookingController.getAllBookings);

// MODIFIED: Add a new route to update a booking's status by its ID.
// This route should also be protected.
router.patch('/bookings/:id', bookingController.updateBookingStatus);

module.exports = router;