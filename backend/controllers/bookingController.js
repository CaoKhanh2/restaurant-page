const Booking = require('../models/booking');
const nodemailer = require('nodemailer');

// MODIFIED: Configuration for sending emails.
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // MODIFIED: Get from .env file
        pass: process.env.EMAIL_PASS  // MODIFIED: Get from .env file
    }
});

// MODIFIED: Logic to create a new booking.
exports.createBooking = async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        // MODIFIED: Send email to the restaurant.
        await transporter.sendMail({
            from: `"Les 4 Saisons Site" <${process.env.EMAIL_USER}>`,
            to: process.env.RESTAURANT_EMAIL,
            subject: `Nouvelle réservation pour ${newBooking.people} personnes - ${newBooking.name}`,
            html: `
                <h3>Vous avez une nouvelle demande de réservation :</h3>
                <ul>
                    <li><strong>Nom :</strong> ${newBooking.name}</li>
                    <li><strong>Email :</strong> ${newBooking.email}</li>
                    <li><strong>Nombre de personnes :</strong> ${newBooking.people}</li>
                    <li><strong>Date :</strong> ${newBooking.date.toLocaleDateString('fr-FR')}</li>
                    <li><strong>Heure :</strong> ${newBooking.time}</li>
                    <li><strong>Message :</strong> ${newBooking.message || 'Aucun'}</li>
                </ul>
                <p>Veuillez vous connecter au panneau d'administration pour confirmer.</p>
            `,
        });
        
        // MODIFIED: Send email to the customer.
        await transporter.sendMail({
            from: `"Restaurant Les 4 Saisons" <${process.env.EMAIL_USER}>`,
            to: newBooking.email,
            subject: 'Votre demande de réservation a bien été reçue',
            html: `
                <h3>Bonjour ${newBooking.name},</h3>
                <p>
                    Nous avons bien reçu votre demande de réservation pour <strong>${newBooking.people} personnes</strong>, 
                    le <strong>${newBooking.date.toLocaleDateString('fr-FR')}</strong> à <strong>${newBooking.time}</strong>.
                </p>
                <p>Nous vous enverrons un email de confirmation dès que nous aurons validé votre demande.</p>
                <p>À bientôt,</p>
                <p><strong>L'équipe du Restaurant Les 4 Saisons</strong></p>
            `,
        });

        res.status(201).json({ message: 'Booking request sent successfully!' });
    } catch (error) {
        console.error('Error in createBooking:', error);
        res.status(500).json({ error: 'An error occurred while creating the booking.' });
    }
};

// MODIFIED: Logic to check for available time slots.
exports.checkAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        // MODIFIED: Business logic to check availability could be added here.
        // MODIFIED: For example, checking if the date is a weekend or if there's a special event.
        // MODIFIED: This is currently a static list and serves as a placeholder.
        const availableTimes = ["11:30", "12:00", "12:30", "13:00", "19:00", "19:30", "20:00", "20:30", "21:00"];
        res.status(200).json({ availableTimes });
    } catch (error) {
        console.error('Error in checkAvailability:', error);
        res.status(500).json({ error: 'Could not fetch availability.' });
    }
};

// MODIFIED: Add a new function to get all bookings for the dashboard.
exports.getAllBookings = async (req, res) => {
    try {
        // Find all bookings and sort them by creation date in descending order.
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
};

// MODIFIED: Add a new function to update a booking's status.
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate the new status.
        if (!['confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status provided.' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }
        
        // Optional: Send a confirmation/cancellation email to the customer here.

        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status.' });
    }
};