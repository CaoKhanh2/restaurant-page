document.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy hàm này khi tìm thấy container của menu
    if (document.querySelector('.menu-columns-container')) {
        renderFullMenu();
    }
});

function renderFullMenu() {
    const container = document.querySelector('.menu-columns-container');
    if (!container || typeof menuData === 'undefined') {
        console.error('Menu container or menuData not found!');
        container.innerHTML = '<p>Erreur lors du chargement du menu.</p>';
        return;
    }

    // Xóa nội dung placeholder
    container.innerHTML = '';

    // Tạo 2 cột
    const column1 = document.createElement('div');
    column1.className = 'menu-column';
    const column2 = document.createElement('div');
    column2.className = 'menu-column';

    const allCategoryKeys = Object.keys(menuData);
    const halfwayPoint = Math.ceil(allCategoryKeys.length / 2);

    // Phân chia các danh mục vào 2 cột
    allCategoryKeys.forEach((key, index) => {
        const categoryData = menuData[key];
        const categoryHtml = generateCategoryHtml(categoryData, key);

        if (index < halfwayPoint) {
            column1.innerHTML += categoryHtml;
        } else {
            column2.innerHTML += categoryHtml;
        }
    });

    container.appendChild(column1);
    container.appendChild(column2);

    // Sau khi menu được tạo, gán sự kiện click để xem chi tiết
    addEventListenersToDishes();
}

// Hàm này tạo HTML cho một danh mục (category)
function generateCategoryHtml(categoryData, categoryKey) {
    let dishesHtml = '';
    categoryData.items.forEach(dish => {
        const isFeatured = dish.featured;
        // Dùng `` để tạo chuỗi đa dòng (template literals)
        dishesHtml += `
            <div class="menu-item ${isFeatured ? 'menu-item-featured' : ''}" 
                 data-name="${dish.name}" 
                 data-image="${dish.image}" 
                 data-description="${dish.description}" 
                 data-price="${dish.price}">
                ${isFeatured ? `<img src="${dish.image}" alt="${dish.name}" class="menu-item-img">` : ''}
                <div class="menu-item-details">
                    <p>${dish.name} <span class="translation">${dish.translation}</span></p>
                    <span>${dish.price}.-</span>
                </div>
            </div>
        `;
    });

    return `
        <div class="menu-category" data-category="${categoryKey}">
            <h3>${categoryData.title}</h3>
            ${dishesHtml}
        </div>
    `;
}

// Hàm này gán sự kiện click cho tất cả món ăn
function addEventListenersToDishes() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const dish = {
                name: item.dataset.name,
                image: item.dataset.image,
                description: item.dataset.description,
                price: item.dataset.price
            };
            // goToDishDetail là hàm từ router.js
            goToDishDetail(dish);
        });
        item.style.cursor = 'pointer';
    });
}