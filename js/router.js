// js/router.js

// Định nghĩa tất cả các đường dẫn của trang web
const APP_ROUTES = {
    home: '/',
    menu: '/menu.html',
    gallery: '/gallery.html',
    about: '/about.html',
    dishDetail: '/sub-page/dish-detail.html'
};

// Hàm điều hướng đến một trang cụ thể
const navigateTo = (path) => {
    window.location.href = path;
};

// Hàm điều hướng đến trang chi tiết món ăn với các tham số
const goToDishDetail = (dish) => {
    const { name, image, description, price } = dish;
    const params = new URLSearchParams({
        name: name,
        image: image,
        description: description,
        price: price
    });

    navigateTo(`${APP_ROUTES.dishDetail}?${params.toString()}`);
};