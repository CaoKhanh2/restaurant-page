// Hàm để tải và chèn nội dung HTML.
const loadHTML = (filePath, elementId, callback) => {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Network response was not ok for ${filePath}`);
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
                if (callback) callback();
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
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

// --- Back to Top Button Logic ---
const initializeBackToTop = () => {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;
    window.addEventListener("scroll", () => {
        backToTopButton.classList.toggle("show", window.pageYOffset > 300);
    });
};

// --- Main Execution on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    const isSubPage = window.location.pathname.includes('/sub-page/');
    const basePath = isSubPage ? '..' : '';

    // 1. Tải Header và Footer
    loadHTML(`${basePath}/_includes/header.html`, 'header-placeholder', initializeMobileNav);
    loadHTML(`${basePath}/_includes/footer.html`, 'footer-placeholder');

    // 2. Kiểm tra và tải Slider Menu nếu có placeholder
    const sliderPlaceholder = document.getElementById('slider-menu-placeholder');
    if (sliderPlaceholder) {
        loadHTML(`${basePath}/_includes/slider-menu.html`, 'slider-menu-placeholder');
    }
    
    // 3. Khởi tạo nút Back to Top
    initializeBackToTop();
});