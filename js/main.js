// main.js - Archivo principal

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    document.getElementById("buscador").addEventListener("input", filtrarProductos);
    document.getElementById("buscador").addEventListener("input", mostrarSugerencias);

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelector("nav ul").classList.remove("active");
        });
    });
});
