// Search script
let searchInput = document.querySelector('.column__search-input');
let searchCross = document.querySelector('.column__search-cross');
let searchSearch = document.querySelector('.column__search-search');
searchInput.addEventListener('change', (event) => {
    if (searchInput.value != '' &&
        searchCross.classList.contains('hidden'))
        searchCross.classList.toggle('hidden');
    else {
        searchCross.classList.toggle('hidden');
        searchInput.value = '';
    }

});
searchCross.addEventListener('click', (event) => {
    searchCross.classList.toggle('hidden');
    searchInput.value = '';
});

// Menu
document.querySelector('.menu__cross').addEventListener('click', (event) => {
    document.querySelector('.header .menu').classList.toggle('hide');
    setTimeout(() => {
        document.querySelector('.header .menu').classList.toggle('none');
    }, 100);
});
document.querySelector('.column__burger').addEventListener('click', (event) => {
    document.querySelector('.header .menu').classList.toggle('none');
    setTimeout(() => {
        document.querySelector('.header .menu').classList.toggle('hide');
    }, 100);
});

// Hide, show search input
document.querySelector('.small-search').addEventListener('click', (event) => {
    document.querySelectorAll('.column').forEach((element) => {
        element.classList.add('column-none');
    });
    document.querySelector('.column-ser').classList.remove('column-none');
    document.querySelector('.window').classList.remove('none');
});
let hideSer = () => {
    document.querySelector('.window').classList.add('none');
    document.querySelectorAll('.column').forEach((element) => {
        element.classList.remove('column-none');
        document.querySelector('.column-ser').classList.add('column-none');
    });

};
window.addEventListener('resize', (event) => {
    if (window.matchMedia("(min-width: 767px)").matches) {
        hideSer();
    }
});
document.querySelector('.window').addEventListener('click', (event) => {
    hideSer();
});