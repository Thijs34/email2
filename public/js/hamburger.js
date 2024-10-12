document.querySelectorAll('nav menu li a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menu-bar').checked = false;
    });
});