const APP_ROUTES = {
    home: '/',
    menu: '/menu.html',
    gallery: '/gallery.html',
    about: '/about.html',
    category: '/sub-page/category.html', // Cập nhật đường dẫn này
    dishDetail: '/sub-page/dish-detail.html'
};

const navigateTo = (path) => {
    window.location.href = path;
};

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