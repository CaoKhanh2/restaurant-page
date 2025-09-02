// Hàm để tải và chèn nội dung HTML.
const loadHTML = (filePath, elementId, callback) => {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${filePath}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                if (callback) {
                    callback();
                }
            }
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = `<p style="color:red;">Error loading content.</p>`;
            }
        });
};

// --- Mobile Navigation Toggle Logic ---
const initializeMobileNav = () => {
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }
};

// --- Slider Menu Logic (đã được tích hợp) ---
const initializeSliderMenu = () => {
    const categories = document.querySelectorAll('#slider-menu .category');
    
    categories.forEach(category => {
        // Gán sự kiện 'click' cho từng mục trong slider
        category.addEventListener('click', () => {
            // Tìm và xóa class 'active' khỏi mục đang active hiện tại
            const currentActive = document.querySelector('#slider-menu .category.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            // Thêm class 'active' vào mục vừa được nhấp
            category.classList.add('active');
        });
    });
};

// --- Back to Top Button Logic ---
const initializeBackToTop = () => {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });
};

// --- Main Execution on DOMContentLoaded ---
// Đây là hàm chính sẽ chạy khi trang được tải xong
document.addEventListener('DOMContentLoaded', function() {
    // 1. Tải Header và Footer
    loadHTML('_includes/header.html', 'header-placeholder', initializeMobileNav);
    loadHTML('_includes/footer.html', 'footer-placeholder');

    // 2. Kiểm tra và tải Slider Menu
    // Chỉ tải slider nếu tìm thấy placeholder của nó trên trang hiện tại
    if (document.getElementById('slider-menu')) {
        loadHTML('_includes/slider-menu.html', 'slider-menu', initializeSliderMenu);
    }
    
    // 3. Khởi tạo nút Back to Top
    initializeBackToTop();
});

// Xử lý form đặt bàn
// Lấy các phần tử
const setTableBtn = document.getElementById('setTableBtn');
const bookingFormContainer = document.getElementById('bookingFormContainer');
const closeFormBtn = document.getElementById('closeFormBtn');

// Hiển thị form khi nhấn nút "Set table"
setTableBtn.addEventListener('click', (e) => {
  e.preventDefault();
  bookingFormContainer.classList.remove('hidden');
  bookingFormContainer.style.display = 'flex';
});

// Đóng form khi nhấn nút "X"
closeFormBtn.addEventListener('click', () => {
  bookingFormContainer.classList.add('hidden');
  bookingFormContainer.style.display = 'none';
});

// Đóng form khi nhấn ra ngoài modal
window.addEventListener('click', (e) => {
  if (e.target === bookingFormContainer) {
    bookingFormContainer.classList.add('hidden');
    bookingFormContainer.style.display = 'none';
  }
});