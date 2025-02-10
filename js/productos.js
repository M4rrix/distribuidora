// productos.js - Manejo de productos - Maneja la carga, filtrado y búsqueda de productos.

let productosGlobales = [];
let categoriaSeleccionada = "todos";

async function cargarProductos() {
    try {
        const response = await fetch("data/productos.json");
        productosGlobales = await response.json();
        mostrarProductos(productosGlobales);
    } catch (error) {
        console.error("Error cargando los productos", error);
    }
}

function mostrarProductos(productos) {
    const contenedor = document.querySelector(".productos-container");
    contenedor.innerHTML = "";
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    productos.forEach(producto => {
        const productoHTML = `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <p>${producto.nombre}</p>
                <select class="marca-select" id="select-${producto.id}">
                    <option value="" disabled selected>Seleccionar marca</option>
                    ${producto.marcas.map(marca => `<option value="${marca}">${marca}</option>`).join("")}
                </select>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}')">Añadir</button>
            </div>
        `;
        contenedor.innerHTML += productoHTML;
    });
}

// 🚀 Filtrar productos por categoría
function filtrarPorCategoria(categoria, boton) {
    categoriaSeleccionada = categoria;

    // Quitar la clase "activo" de todos los botones
    document.querySelectorAll(".categorias-container button").forEach(btn => {
        btn.classList.remove("activo");
    });

    // Agregar la clase "activo" solo al botón seleccionado
    boton.classList.add("activo");

    filtrarProductos(); // Aplicamos el filtrado con la nueva categoría
}

function mostrarSugerencias() {
    const busqueda = document.getElementById("buscador").value.toLowerCase().trim();
    const sugerenciasContainer = document.getElementById("sugerencias");
    sugerenciasContainer.innerHTML = "";
    
    if (busqueda.length === 0) {
        sugerenciasContainer.style.display = "none";
        return;
    }

    // Filtrar productos considerando también la categoría
    let productosFiltrados = productosGlobales.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda) || 
        producto.categoria.toLowerCase().includes(busqueda)
    );

    productosFiltrados.forEach(producto => {
        const item = document.createElement("div");
        item.classList.add("sugerencia-item");
        item.textContent = `${producto.nombre} (${producto.categoria})`; // Mostrar también la categoría
        item.onclick = () => seleccionarSugerencia(producto.nombre);
        sugerenciasContainer.appendChild(item);
    });

    sugerenciasContainer.style.display = productosFiltrados.length > 0 ? "block" : "none";
}

function seleccionarSugerencia(nombre) {
    document.getElementById("buscador").value = nombre;
    document.getElementById("sugerencias").style.display = "none";
    filtrarProductos();
}

// 🚀 Función para filtrar productos en tiempo real por búsqueda y categoría
function filtrarProductos() {
    const busqueda = document.getElementById("buscador")?.value.toLowerCase() || "";
    
    let productosFiltrados = productosGlobales.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.marcas.some(marca => marca.toLowerCase().includes(busqueda))
    );

    if (categoriaSeleccionada !== "todos") {
        productosFiltrados = productosFiltrados.filter(producto => producto.categoria === categoriaSeleccionada);
    }

    mostrarProductos(productosFiltrados);
}
