document.addEventListener('DOMContentLoaded', function() {
    // Sử dụng MutationObserver để đảm bảo slider-menu đã được tải xong trước khi chạy logic
    const observer = new MutationObserver((mutations, obs) => {
        // Kiểm tra xem slider đã được thêm vào DOM chưa
        const filterContainer = document.querySelector('#menu-slider .menu-categories');
        if (filterContainer) {
            initializeMenuFilter();
            obs.disconnect(); // Ngừng theo dõi sau khi đã tìm thấy
            return;
        }
    });

    // Bắt đầu theo dõi sự thay đổi trong placeholder
    const targetNode = document.getElementById('slider-menu-placeholder');
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }
});

function initializeMenuFilter() {
    const filterButtons = document.querySelectorAll('#menu-slider .category');
    const menuCategories = document.querySelectorAll('#full-menu-page .menu-category');

    // Nếu không tìm thấy nút hoặc danh mục, không làm gì cả
    if (filterButtons.length === 0 || menuCategories.length === 0) {
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>

            const filterValue = button.dataset.filter;

            // Cập nhật trạng thái "active" cho các nút
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Ẩn/hiện các danh mục món ăn
            menuCategories.forEach(category => {
                if (filterValue === 'tous' || category.dataset.category === filterValue) {
                    category.style.display = 'block'; // Hiện
                } else {
                    category.style.display = 'none'; // Ẩn
                }
            });
        });
    });
}