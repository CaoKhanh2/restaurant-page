document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    if (!reservationForm) return;

    const dateInput = document.getElementById('date');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const hiddenTimeInput = document.getElementById('time');
    const status = document.getElementById('form-status');

    // Thiết lập ngày tối thiểu là ngày hôm nay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateInput.setAttribute('min', today.toISOString().split('T')[0]);

    // Hàm gọi API để lấy giờ trống
    async function fetchAvailableTimes(date) {
        timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder">Chargement des horaires...</p>';
        try {
            // URL trỏ đến backend của bạn
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

    // Hàm hiển thị các nút chọn giờ
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

    // Sự kiện khi người dùng thay đổi ngày
    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            fetchAvailableTimes(selectedDate);
        } else {
            timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder">Veuillez sélectionner une date d'abord</p>';
        }
        hiddenTimeInput.value = ''; // Reset giờ đã chọn khi đổi ngày
    });

    // Sự kiện khi người dùng chọn một giờ
    timeSlotsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('time-slot-btn')) {
            // Xóa lựa chọn cũ
            const currentlySelected = timeSlotsContainer.querySelector('.selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }

            // Đánh dấu nút được chọn
            const btn = event.target;
            btn.classList.add('selected');
            hiddenTimeInput.value = btn.dataset.time;
        }
    });

    // Sự kiện khi gửi form
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
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                status.innerHTML = "Merci ! Votre demande a bien été envoyée.";
                status.style.color = 'lightgreen';
                form.reset();
                timeSlotsContainer.innerHTML = '<p class="time-slots-placeholder">Veuillez sélectionner une date d'abord</p>';
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