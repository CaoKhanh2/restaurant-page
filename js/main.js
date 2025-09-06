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

// --- Dish Detail Page Link Logic ---
// --- Dish Detail Page Link Logic (Sử dụng Router) ---
const initializeDishLinks = () => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Lấy thông tin từ data attributes
            const dish = {
                name: item.dataset.name,
                image: item.dataset.image,
                description: item.dataset.description,
                price: item.dataset.price
            };
            
            // Sử dụng hàm từ router.js để điều hướng
            goToDishDetail(dish);
        });

        item.style.cursor = 'pointer';
    });
};

// --- Main Execution on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Tải Header và Footer
    loadHTML('/_includes/header.html', 'header-placeholder', initializeMobileNav);
    loadHTML('/_includes/footer.html', 'footer-placeholder');

    // 2. Kiểm tra và tải Slider Menu
    if (document.getElementById('slider-menu')) {
        loadHTML('/_includes/slider-menu.html', 'slider-menu');
    }
    
    // 3. Khởi tạo nút Back to Top
    initializeBackToTop();

    // 4. Khởi tạo liên kết món ăn (chỉ chạy trên trang menu)
    if (document.getElementById('full-menu-page')) {
        initializeDishLinks();
    }
});