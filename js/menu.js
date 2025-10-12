document.addEventListener('DOMContentLoaded', function() {
    // MODIFIED: Use MutationObserver to ensure the slider-menu is loaded before running the logic.
    const observer = new MutationObserver((mutations, obs) => {
        // MODIFIED: Check if the slider has been added to the DOM.
        const filterContainer = document.querySelector('#menu-slider .menu-categories');
        if (filterContainer) {
            initializeMenuFilter();
            obs.disconnect(); // MODIFIED: Stop observing after it's found.
            return;
        }
    });

    // MODIFIED: Start observing changes in the placeholder.
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

    // MODIFIED: If no buttons or categories are found, do nothing.
    if (filterButtons.length === 0 || menuCategories.length === 0) {
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // MODIFIED: Prevent the default behavior of the <a> tag.

            const filterValue = button.dataset.filter;

            // MODIFIED: Update the "active" state for the buttons.
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // MODIFIED: Show/hide the dish categories.
            menuCategories.forEach(category => {
                if (filterValue === 'tous' || category.dataset.category === filterValue) {
                    category.style.display = 'block'; // MODIFIED: Show
                } else {
                    category.style.display = 'none'; // MODIFIED: Hide
                }
            });
        });
    });
}