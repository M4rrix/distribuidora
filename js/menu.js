// menu.js - Control del menú -  Controla el menú hamburguesa y su funcionalidad.

function toggleMenu() {
    document.querySelector("nav ul").classList.toggle("active");
}

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector("nav ul").classList.remove("active");
    });
});