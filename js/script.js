

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    document.getElementById("buscador").addEventListener("input", filtrarProductos);
    document.getElementById("buscador").addEventListener("input", mostrarSugerencias);
});


let productosGlobales = []; // Guardamos los productos para filtrado
let categoriaSeleccionada = "todos"; // Al inicio, se muestran todos los productos

async function cargarProductos() {
    try {
        const response = await fetch("data/productos.json");
        productosGlobales = await response.json();
        mostrarProductos(productosGlobales);
    } catch (error) {
        console.error("Error cargando los productos", error);
    }
}

function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

function mostrarProductos(productos) {
    const contenedor = document.querySelector(".productos-container");
    contenedor.innerHTML = "";

      // Ordenar los productos alfabéticamente por nombre
      productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    productos.forEach(producto => {
        const productoHTML = `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
    
                
                <!-- Dropdown de marcas -->
                <select class="marca-select" id="select-${producto.id}">
                    <option value="" disabled selected>Seleccionar marca</option>
                    ${producto.marcas.map(marca => `<option value="${marca}">${marca}</option>`).join("")}
                </select>

                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}')">Agregar al carrito</button>
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
        producto.nombre.toLowerCase().includes(busqueda)
    );

    if (categoriaSeleccionada !== "todos") {
        productosFiltrados = productosFiltrados.filter(producto => producto.categoria === categoriaSeleccionada);
    }

    mostrarProductos(productosFiltrados);
}


// Función para agregar productos al carrito
let carrito = [];

function agregarAlCarrito(id, nombre) {
    const select = document.getElementById(`select-${id}`);
    const marcaSeleccionada = select.value;

    if (!marcaSeleccionada) {
        alert("Por favor, selecciona una marca antes de agregar al carrito.");
        return;
    }

    const productoExiste = carrito.find(item => item.id === id && item.marca === marcaSeleccionada);
    if (productoExiste) {
        productoExiste.cantidad++;
    } else {
        carrito.push({ id, nombre, marca: marcaSeleccionada, cantidad: 1 });
    }
    actualizarCarrito();
}

function actualizarCarrito() {
    const carritoContainer = document.querySelector(".carrito-container");
    carritoContainer.innerHTML = "";

    carrito.forEach(producto => {
        const productoCarritoHTML = `
            <div class="carrito-item">
                <p>${producto.nombre} x ${producto.cantidad} - ${producto.marca}</p>
                <button onclick="disminuirCantidad(${producto.id})">➖</button>
                <button onclick="aumentarCantidad(${producto.id})">➕</button>
                <button onclick="eliminarDelCarrito(${producto.id})">❌</button>
            </div>
        `;
        carritoContainer.innerHTML += productoCarritoHTML;
    });
    
    
}

// Función para aumentar la cantidad de un producto
function aumentarCantidad(id) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad++;
        actualizarCarrito();
    }
}

// Función para disminuir la cantidad de un producto
function disminuirCantidad(id) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(id); // Eliminar el producto si la cantidad llega a 0
        } else {
            actualizarCarrito();
        }
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== id);
    actualizarCarrito();
}

//Funcion para enviar pedidos por WP
function enviarWhatsapp() {
    // Crea un mensaje con los productos del carrito
    let mensaje = "Hola, me gustaría hacer un pedido:\n\n";
    
    carrito.forEach(producto => {
        mensaje += `Producto: ${producto.nombre}, Marca: ${producto.marca}, Cantidad: ${producto.cantidad}\n`;
    });

    // Enlace de WhatsApp para enviar el mensaje
    const whatsappLink = `https://wa.me/2920308378?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappLink, "_blank");
}


