document.addEventListener('DOMContentLoaded', () => {
    const bookingListContainer = document.getElementById('booking-list');
    const statusFilter = document.getElementById('status-filter');

    if (!bookingListContainer || !statusFilter) {
        console.error('Essential dashboard elements are missing.');
        return;
    }

    let allBookings = [];

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }
            allBookings = await response.json();
            renderBookings();
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            bookingListContainer.innerHTML = `<p style="color: red;">Error loading bookings: ${error.message}.</p>`;
        }
    };

    const renderBookings = () => {
        const filterValue = statusFilter.value;
        const filteredBookings = allBookings.filter(booking => {
            if (filterValue === 'all') return true;
            return booking.status === filterValue;
        });

        bookingListContainer.innerHTML = '';

        if (filteredBookings.length === 0) {
            bookingListContainer.innerHTML = '<p>No bookings found for this filter.</p>';
            return;
        }

        filteredBookings.forEach(booking => {
            const card = document.createElement('div');
            card.className = 'booking-card';
            card.dataset.id = booking._id;
            const bookingDate = new Date(booking.date).toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            card.innerHTML = `
                <div class="card-header">
                    <h3>${booking.name}</h3>
                    <span class="status-badge status-${booking.status}">${booking.status}</span>
                </div>
                <div class="card-body">
                    <p><i class="fas fa-calendar-alt"></i> ${bookingDate}</p>
                    <p><i class="fas fa-clock"></i> ${booking.time}</p>
                    <p><i class="fas fa-users"></i> ${booking.people} personnes</p>
                    <p><i class="fas fa-envelope"></i> ${booking.email}</p>
                    ${booking.message ? `<div class="special-request"><strong>Message:</strong> ${booking.message}</div>` : ''}
                </div>
                <div class="card-actions">
                    ${booking.status === 'pending' ? `
                        <button class="btn-confirm">Confirm</button>
                        <button class="btn-cancel">Cancel</button>
                    ` : ''}
                </div>
            `;
            bookingListContainer.appendChild(card);
        });
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            const bookingIndex = allBookings.findIndex(b => b._id === bookingId);
            if (bookingIndex !== -1) {
                allBookings[bookingIndex].status = newStatus;
            }
            renderBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Could not update the booking status. Please try again.');
        }
    };

    try {
        const socket = io("http://localhost:5000");

        socket.on('connect', () => {
            console.log('✅ Successfully connected to WebSocket server!');
        });

        socket.on('new_booking_added', (newBookingData) => {
            console.log('🎉 New booking received via WebSocket:', newBookingData);
            allBookings.unshift(newBookingData);
            renderBookings();
        });

        socket.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err.message);
        });

    } catch (error) {
        console.error('Failed to initialize Socket.IO:', error);
    }

    statusFilter.addEventListener('change', renderBookings);
    bookingListContainer.addEventListener('click', (event) => {
        const target = event.target;
        const card = target.closest('.booking-card');
        if (!card) return;
        const bookingId = card.dataset.id;
        if (target.classList.contains('btn-confirm')) {
            if (confirm('Are you sure you want to confirm this booking?')) {
                updateBookingStatus(bookingId, 'confirmed');
            }
        } else if (target.classList.contains('btn-cancel')) {
            if (confirm('Are you sure you want to cancel this booking?')) {
                updateBookingStatus(bookingId, 'cancelled');
            }
        }
    });
    
    fetchBookings();
});