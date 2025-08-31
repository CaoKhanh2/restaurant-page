document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.category');
    const indicator = document.querySelector('.indicator');
    
    // Check if indicator exists to avoid errors on the menu page
    if (indicator) {
        const numCategories = categories.length;

        categories.forEach((category, index) => {
            category.addEventListener('click', () => {
                // Remove 'active' class from all categories
                if (document.querySelector('.category.active')) {
                    document.querySelector('.category.active').classList.remove('active');
                }
                
                // Add 'active' class to the clicked category
                category.classList.add('active');
                
                // Move the indicator
                const percentage = index * (100 / numCategories);
                indicator.style.left = `${percentage}%`;
            });
        });
    }
});
