// carrito.js - Manejo del carrito de compras

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
});

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

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
    guardarCarritoEnLocalStorage();
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
    guardarCarritoEnLocalStorage();
    
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