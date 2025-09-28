const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// URL để tạo một yêu cầu đặt bàn mới
router.post('/bookings', bookingController.createBooking);
    
// URL để kiểm tra các giờ còn trống
router.get('/availability', bookingController.checkAvailability);

module.exports = router;