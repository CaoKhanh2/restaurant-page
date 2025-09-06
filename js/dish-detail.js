document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const dishName = params.get('name');
    let dishImage = params.get('image');
    const dishDescription = params.get('description');
    const dishPrice = params.get('price');

    // Thêm tiền tố '../' vào đường dẫn ảnh
    if (dishImage) {
        dishImage = `../${dishImage}`;
    }

    document.getElementById('dish-name').textContent = dishName;
    document.getElementById('dish-img').src = dishImage;
    document.getElementById('dish-img').alt = `Image de ${dishName}`;
    document.getElementById('dish-description').textContent = dishDescription || "Aucune description disponible pour ce plat.";
    document.getElementById('dish-price').textContent = `${dishPrice}.-`;
});