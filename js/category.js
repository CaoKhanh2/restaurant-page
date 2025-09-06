document.addEventListener('DOMContentLoaded', function() {
    // Lấy thông tin danh mục từ URL
    const params = new URLSearchParams(window.location.search);
    const categoryKey = params.get('category');

    const titleElement = document.getElementById('category-title');
    const container = document.getElementById('dish-list-container');

    if (!categoryKey || typeof menuData === 'undefined' || !container || !titleElement) { return; }

    const categoryData = menuData[categoryKey];
    if (!categoryData) { return; }

    titleElement.textContent = categoryData.title;

    // Lọc và chỉ giữ lại những món có hình ảnh thật
    const dishesWithImages = categoryData.items.filter(dish => 
        dish.image && !dish.image.includes('placeholder')
    );

    // const dishesWithImages = categoryData.items;

    // Tạo HTML cho các món ăn có hình ảnh
    let htmlContent = '';
    dishesWithImages.forEach(dish => {
        const imagePath = `../${dish.image}`;
        htmlContent += `
            <div class="dish-card" 
                 data-name="${dish.name}" 
                 data-image="${dish.image}" 
                 data-description="${dish.description}" 
                 data-price="${dish.price}">
                <img src="${imagePath}" alt="${dish.name}" class="dish-card-img">
                <div class="dish-card-info">
                    <div>
                        <h4>${dish.name}</h4>
                        <span class="translation">${dish.translation || ''}</span>
                    </div>
                    <span class="price">${dish.price}.-</span>
                </div>
            </div>
        `;
    });
    
    // THÊM THẺ ẢO ĐỂ LẤP ĐẦY HÀNG CUỐI (áp dụng cho bố cục 3 cột)
    // Bạn có thể thay đổi số 3 nếu muốn bố cục 2 hoặc 4 cột
    const itemsPerRow = 3;
    if (dishesWithImages.length > 0) {
        const itemsOnLastRow = dishesWithImages.length % itemsPerRow;
        if (itemsOnLastRow !== 0) {
            const phantomsToCreate = itemsPerRow - itemsOnLastRow;
            for (let i = 0; i < phantomsToCreate; i++) {
                htmlContent += `<div class="dish-card phantom"></div>`;
            }
        }
    }
    
    // Hiển thị kết quả ra trang
    if (dishesWithImages.length > 0) {
        container.innerHTML = `<div class="imaged-dishes-grid">${htmlContent}</div>`;
    } else {
        container.innerHTML = "<p style='text-align: center;'>Aucun plat à afficher dans cette catégorie pour le moment.</p>";
    }
    
    // Gán lại sự kiện click cho các món ăn (loại trừ thẻ ảo)
    addEventListenersToDishes();
});

function addEventListenersToDishes() {
    const menuItems = document.querySelectorAll('#dish-list-container .dish-card:not(.phantom)');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const dish = {
                name: item.dataset.name,
                image: item.dataset.image,
                description: item.dataset.description,
                price: item.dataset.price
            };
            if (typeof goToDishDetail === 'function') {
                goToDishDetail(dish);
            }
        });
    });
}