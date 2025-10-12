const Booking = require('../models/booking');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// --- Nodemailer Configuration ---
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- Helper Function for Email Templates ---
const getEmailHtml = (templateName, data) => {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', templateName);
        
        if (!fs.existsSync(templatePath)) {
            console.error(`Email template not found at: ${templatePath}`);
            return null;
        }

        let html = fs.readFileSync(templatePath, 'utf8');
        
        for (const key in data) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key]);
        }
        return html;

    } catch (error) {
        console.error(`Error reading email template ${templateName}:`, error);
        return null;
    }
};


// --- Controller Functions ---

exports.createBooking = async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        const formattedDate = newBooking.date.toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });

        const emailData = {
            name: newBooking.name,
            date: formattedDate,
            time: newBooking.time,
            people: newBooking.people
        };
        
        const customerEmailHtml = getEmailHtml('email-customer-booking-request.html', emailData);
        if (customerEmailHtml) {
            await transporter.sendMail({
                from: `"Restaurant Les 4 Saisons" <${process.env.EMAIL_USER}>`,
                to: newBooking.email,
                subject: 'Votre demande de réservation a bien été reçue',
                html: customerEmailHtml,
            });
        }
        
        await transporter.sendMail({
            from: `"Les 4 Saisons Site" <${process.env.EMAIL_USER}>`,
            to: process.env.RESTAURANT_EMAIL,
            subject: `Nouvelle réservation pour ${newBooking.people} personnes - ${newBooking.name}`,
            html: `<h3>Nouvelle demande de réservation reçue. Veuillez consulter le dashboard.</h3>`,
        });

        const io = req.io;
        if (io) {
            io.emit('new_booking_added', newBooking);
        }

        res.status(201).json({ message: 'Booking request sent successfully!' });

    } catch (error) {
        console.error('CRITICAL ERROR in createBooking:', error);
        res.status(500).json({ error: 'An internal server error occurred while creating the booking.' });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status provided.' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }
        
        let templateName = '';
        let emailSubject = '';

        if (status === 'confirmed') {
            templateName = 'email-customer-booking-confirmed.html';
            emailSubject = 'Votre réservation est confirmée !';
        } else if (status === 'cancelled') {
            templateName = 'email-customer-booking-cancelled.html';
            emailSubject = 'Annulation de votre réservation';
        }

        if (templateName) {
            const formattedDate = updatedBooking.date.toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
            const emailData = {
                name: updatedBooking.name,
                date: formattedDate,
                time: updatedBooking.time,
                people: updatedBooking.people
            };
            const emailHtml = getEmailHtml(templateName, emailData);

            if (emailHtml) {
                await transporter.sendMail({
                    from: `"Restaurant Les 4 Saisons" <${process.env.EMAIL_USER}>`,
                    to: updatedBooking.email,
                    subject: emailSubject,
                    html: emailHtml,
                });
            }
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('CRITICAL ERROR in updateBookingStatus:', error);
        res.status(500).json({ error: 'Failed to update booking status.' });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
};

exports.checkAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        const availableTimes = ["11:30", "12:00", "12:30", "13:00", "19:00", "19:30", "20:00", "20:30", "21:00"];
        res.status(200).json({ availableTimes });
    } catch (error) {
        console.error('Error in checkAvailability:', error);
        res.status(500).json({ error: 'Could not fetch availability.' });
    }
};