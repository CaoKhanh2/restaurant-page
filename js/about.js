document.addEventListener('DOMContentLoaded', function() {
    // Tìm form và các phần tử liên quan trên trang
    const reservationForm = document.getElementById('reservationForm');
    
    // Chỉ chạy mã nếu tìm thấy form trên trang hiện tại
    if (reservationForm) {
        const formInputs = reservationForm.querySelectorAll('input, textarea');
        const noticeOverlay = document.getElementById('booking-notice');
        let isNoticeShown = false;

        // Hàm hiển thị thông báo
        const showNotice = () => {
            if (!isNoticeShown) {
                noticeOverlay.classList.add('visible');
                isNoticeShown = true;
            }
        };

        // Lắng nghe sự kiện "focus" trên tất cả các ô nhập liệu
        // Khi người dùng click vào bất kỳ ô nào, thông báo sẽ hiện ra
        formInputs.forEach(input => {
            input.addEventListener('focus', showNotice);
        });

        // Ngăn form gửi đi khi nhấn nút "Envoyer"
        reservationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Chặn hành động mặc định của form
            showNotice(); // Hiển thị lại thông báo nếu cần
        });
    }
});