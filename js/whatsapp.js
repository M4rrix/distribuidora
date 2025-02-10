// whatsapp.js - Enviar pedido por WhatsApp

function enviarWhatsapp() {
    let mensaje = "Hola, me gustaría hacer un pedido:\n\n";
    carrito.forEach(producto => {
        mensaje += `Producto: ${producto.nombre}, Marca: ${producto.marca}, Cantidad: ${producto.cantidad}\n`;
    });
    const numeroWhatsApp = "2920308378";
    const whatsappLink = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappLink, "_blank");
}
