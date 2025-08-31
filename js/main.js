// Hàm để tải và chèn nội dung HTML.
// Tôi đã thêm một tham số "callback" để nó có thể chạy một hàm khác sau khi tải xong.
const loadHTML = (filePath, elementId, callback) => {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            // Nếu có hàm callback được truyền vào, hãy chạy nó
            if (callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
            document.getElementById(elementId).innerHTML = `<p style="color:red;">Error loading content.</p>`;
        });
};

// --- Mobile Navigation Toggle ---
// Tách logic xử lý menu ra một hàm riêng
const initializeMobileNav = () => {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Thay đổi icon từ bars (gạch) sang x (đóng)
            const icon = mobileNavToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    } else {
        // Ghi log nếu không tìm thấy nút để dễ dàng gỡ lỗi
        console.log("Mobile navigation elements not found.");
    }
};

// Khi toàn bộ DOM đã được tải...
document.addEventListener('DOMContentLoaded', function() {
    // Tải footer như bình thường
    loadHTML('_includes/footer.html', 'footer-placeholder');
    
    // Tải header, và SAU KHI tải xong, chạy hàm initializeMobileNav
    loadHTML('_includes/header.html', 'header-placeholder', initializeMobileNav);
});