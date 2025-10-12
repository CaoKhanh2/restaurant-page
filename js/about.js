document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    if (!reservationForm) return;

    const dateInput = document.getElementById('date');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const hiddenTimeInput = document.getElementById('time');
    const status = document.getElementById('form-status');

    // MODIFIED: Set the minimum date to today.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateInput.setAttribute('min', today.toISOString().split('T')[0]);

    // MODIFIED: Function to call the API to get available time slots.
    async function fetchAvailableTimes(date) {
        timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder">Chargement des horaires...</p>';
        try {
            // MODIFIED: In a production environment, this URL should not be hardcoded.
            // It should be a relative path (e.g., '/api/availability') or configured via an environment variable.
            const response = await fetch(`http://localhost:5000/api/availability?date=${date}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            renderTimeSlots(data.availableTimes);
        } catch (error) {
            console.error('Failed to fetch available times:', error);
            timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder" style="color: red;">Impossible de charger les horaires. Veuillez réessayer.</p>';
        }
    }

    // MODIFIED: Function to display the time slot selection buttons.
    function renderTimeSlots(times) {
        timeSlotsContainer.innerHTML = '';
        if (times.length === 0) {
            timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder">Aucun créneau disponible pour cette date.</p>';
            return;
        }

        times.forEach(time => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'time-slot-btn';
            btn.textContent = time;
            btn.dataset.time = time;
            timeSlotsContainer.appendChild(btn);
        });
    }

    // MODIFIED: Event when the user changes the date.
    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            fetchAvailableTimes(selectedDate);
        } else {
            timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder">Veuillez sélectionner une date d\'abord</p>';
        }
        hiddenTimeInput.value = ''; // MODIFIED: Reset the selected time when the date changes.
    });

    // MODIFIED: Event when the user selects a time.
    timeSlotsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('time-slot-btn')) {
            // MODIFIED: Clear the old selection.
            const currentlySelected = timeSlotsContainer.querySelector('.selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }

            // MODIFIED: Mark the selected button.
            const btn = event.target;
            btn.classList.add('selected');
            hiddenTimeInput.value = btn.dataset.time;
        }
    });

    // MODIFIED: Event when the form is submitted.
    reservationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        
        const formData = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            people: form.elements.people.value,
            date: form.elements.date.value,
            time: form.elements.time.value,
            message: form.elements.message.value,
        };

        if (!formData.time) {
            alert('Veuillez sélectionner une heure.');
            return;
        }

        status.textContent = 'Envoi en cours...';
        status.style.color = '#ccc';

        try {
            // MODIFIED: The backend URL should ideally be configured, not hardcoded.
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                status.innerHTML = "Merci ! Votre demande a bien été envoyée.";
                status.style.color = 'lightgreen';
                form.reset();
                timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder">Veuillez sélectionner une date d\'abord</p>';
            } else {
                status.innerHTML = "Désolé, une erreur s'est produite.";
                status.style.color = 'red';
            }
        } catch (error) {
            status.innerHTML = "Impossible de se connecter au serveur de réservation.";
            status.style.color = 'red';
        }
    });
});