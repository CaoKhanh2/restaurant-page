const Booking = require('../models/booking');
const nodemailer = require('nodemailer');

// Cấu hình để gửi email
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Lấy từ tệp .env
        pass: process.env.EMAIL_PASS  // Lấy từ tệp .env
    }
});

// Logic để tạo một đặt bàn mới
exports.createBooking = async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();

        // Gửi email cho nhà hàng
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
        
        // Gửi email cho khách hàng
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

// Logic để kiểm tra giờ trống
exports.checkAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        // Logic nghiệp vụ để kiểm tra giờ có thể được thêm ở đây
        // Ví dụ: kiểm tra xem ngày có phải cuối tuần, hoặc có sự kiện đặc biệt không.
        const availableTimes = ["11:30", "12:00", "12:30", "13:00", "19:00", "19:30", "20:00", "20:30", "21:00"];
        res.status(200).json({ availableTimes });
    } catch (error) {
        console.error('Error in checkAvailability:', error);
        res.status(500).json({ error: 'Could not fetch availability.' });
    }
};