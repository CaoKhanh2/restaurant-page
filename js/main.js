/**
 * Tải và chèn nội dung HTML vào một phần tử được chỉ định.
 * @param {string} filePath - Đường dẫn tương đối đến tệp HTML cần tải.
 * @param {string} elementId - ID của phần tử sẽ nhận nội dung.
 * @param {function} [callback] - Một hàm tùy chọn sẽ được gọi sau khi tải thành công.
 */
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
                element.innerHTML = `<p style="color:red; text-align: center;">Error loading component: ${elementId}.</p>`;
            }
        });
};

/**
 * Khởi tạo chức năng cho menu điều hướng trên di động.
 */
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

/**
 * Khởi tạo chức năng cho nút "Back to Top".
 */
const initializeBackToTop = () => {
    const backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        });
        // Không cần sự kiện click vì href="#" đã xử lý việc cuộn lên top
    }
};

// Hàm chính sẽ được gọi từ các tệp HTML
function initializePage(paths) {
    document.addEventListener('DOMContentLoaded', function() {
        // Tải các thành phần chung
        loadHTML(paths.header, 'header-placeholder', initializeMobileNav);
        loadHTML(paths.footer, 'footer-placeholder', initializeBackToTop);

        // Tải slider-menu nếu có placeholder
        if (document.getElementById('slider-menu')) {
            loadHTML(paths.sliderMenu, 'slider-menu');
        }
    });
}