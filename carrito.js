// Datos de productos por categoría
let categorias = {
    "Vacunas": [
        { nombre: "Nobivac Parvo/Moquillo", precio: 450, img: "imagenes/nobivac_parvo_moquillo.png", inventario: 50 },
        { nombre: "Nobivac Rabia", precio: 250, img: "imagenes/nobivac_rabia.png", inventario: 50 },
        { nombre: "Purevax RCP", precio: 480, img: "imagenes/purevax_rcp.png", inventario: 50 },
        { nombre: "Felocell RCP", precio: 460, img: "imagenes/felocell_rcp.png", inventario: 50 }
    ],
    "Desparasitantes": [
        { nombre: "NexGard", precio: 650, img: "imagenes/nexgard.png", inventario: 50 },
        { nombre: "Bravecto", precio: 950, img: "imagenes/bravecto.png", inventario: 50 },
        { nombre: "Revolution", precio: 600, img: "imagenes/revolution.png", inventario: 50 },
        { nombre: "Drontal", precio: 180, img: "imagenes/drontal.png", inventario: 50 },
        { nombre: "Milbemax", precio: 250, img: "imagenes/milbemax.png", inventario: 50 }
    ],
    "Vitaminas y Suplementos": [
        { nombre: "Cosequin", precio: 850, img: "imagenes/cosequin.png", inventario: 50 },
        { nombre: "Dasuquin", precio: 900, img: "imagenes/dasuquin.png", inventario: 50 },
        { nombre: "Omega 3", precio: 320, img: "imagenes/omega3.png", inventario: 50 },
        { nombre: "FortiFlora", precio: 690, img: "imagenes/fortiflora.png", inventario: 50 }
    ],
    "Alimentos": [
        { nombre: "Hill's Science Diet 2kg", precio: 67, img: "imagenes/hills.png", inventario: 50 },
        { nombre: "Royal Canin Cachorro 2kg", precio: 74, img: "imagenes/royalcanin.png", inventario: 50 },
        { nombre: "Purina Pro Plan Esterilizado", precio: 160, img: "imagenes/proplan.png", inventario: 50 },
        { nombre: "Blue Buffalo 2kg", precio: 700, img: "imagenes/bluebuffalo.png", inventario: 50 }
    ],
    "Medicamentos": [
        { nombre: "Amoxicilina 250mg", precio: 180, img: "imagenes/amoxicilina.png", inventario: 50 },
        { nombre: "Cefalexina 500mg", precio: 220, img: "imagenes/cefalexina.png", inventario: 50 },
        { nombre: "Prednisolona 5mg", precio: 160, img: "imagenes/prednisolona.png", inventario: 50 },
        { nombre: "Meloxicam 5mg", precio: 200, img: "imagenes/meloxicam.png", inventario: 50 },
        { nombre: "Apoquel 5.4mg", precio: 950, img: "imagenes/apoquel.png", inventario: 50 }
    ],
    "Accesorios": [
        { nombre: "Kong Classic", precio: 280, img: "imagenes/kong.png", inventario: 50 },
        { nombre: "Arnés acolchado M", precio: 220, img: "imagenes/arnes.png", inventario: 50 },
        { nombre: "Correa reforzada", precio: 150, img: "imagenes/correa.png", inventario: 50 },
        { nombre: "Cama suave mediana", precio: 450, img: "imagenes/cama.png", inventario: 50 },
        { nombre: "Cepillo FURminator", precio: 350, img: "imagenes/furminator.png", inventario: 50 }
    ]
};

// Variables globales
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = parseFloat(localStorage.getItem("total")) || 0;
let metodoPagoSeleccionado = 'efectivo';

// Elementos del DOM
const cartTotalElement = document.getElementById("cartTotal");
const modalCartTotalElement = document.getElementById("modalCartTotal");
const productContainer = document.getElementById("productContainer");
const cartModal = document.getElementById("cartModal");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const paypalButtonContainer = document.getElementById("paypal-button-container");

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    actualizarTotalPantalla();
    renderProducts();
    inicializarPayPal();
});

// Funciones de utilidad
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.textContent = mensaje;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function actualizarTotalPantalla() {
    cartTotalElement.innerText = total;
    if (modalCartTotalElement) {
        modalCartTotalElement.innerText = total;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", total);
}

// Renderizar productos
function renderProducts() {
    productContainer.innerHTML = "";
    for (let categoria in categorias) {
        let catDiv = document.createElement("div");
        catDiv.className = "category";
        catDiv.innerHTML = `<h2>${categoria}</h2>`;

        let grid = document.createElement("div");
        grid.className = "grid";

        categorias[categoria].forEach((p, i) => {
            let card = document.createElement("div");
            card.className = "card";
            
            let badge = p.inventario < 10 ? '<div class="product-badge">¡Últimas unidades!</div>' : '';
            
            card.innerHTML = `
                <div class="product-image">
                    <img src="${p.img}" alt="${p.nombre}" onerror="this.src='https://via.placeholder.com/200x200?text=${encodeURIComponent(p.nombre)}'">
                    ${badge}
                </div>
                <div class="product-info">
                    <h3>${p.nombre}</h3>
                    <div class="product-price">$${p.precio}</div>
                    <div class="product-stock">Disponibles: ${p.inventario}</div>
                    <button class="btn-add" onclick="agregar('${categoria}', ${i})">
                        🛒 Agregar al carrito
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        catDiv.appendChild(grid);
        productContainer.appendChild(catDiv);
    }
}

// Agregar al carrito
function agregar(cat, i) {
    let p = categorias[cat][i];
    
    if (p.inventario <= 0) {
        mostrarNotificacion("Producto agotado", "error");
        return;
    }

    let cantidad = prompt(`¿Cuántos "${p.nombre}" deseas comprar? (Máximo ${p.inventario})`, "1");
    
    if (cantidad === null) return;
    
    cantidad = parseInt(cantidad);
    
    if (isNaN(cantidad) || cantidad <= 0) {
        mostrarNotificacion("Cantidad no válida", "error");
        return;
    }
    
    if (cantidad > p.inventario) {
        mostrarNotificacion(`Solo hay ${p.inventario} unidades disponibles`, "error");
        return;
    }

    p.inventario -= cantidad;
    
    let existingItem = cart.find(item => item.nombre === p.nombre);
    
    if (existingItem) {
        existingItem.cantidad += cantidad;
        existingItem.subtotal = existingItem.cantidad * p.precio;
    } else {
        cart.push({
            nombre: p.nombre,
            cantidad: cantidad,
            precio: p.precio,
            subtotal: p.precio * cantidad
        });
    }

    total += p.precio * cantidad;
    
    actualizarTotalPantalla();
    renderProducts();
    mostrarNotificacion(`✅ ${cantidad} ${p.nombre} agregado${cantidad > 1 ? 's' : ''} al carrito`);
}

// Vaciar carrito
function vaciarCarrito() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        cart.forEach(item => {
            for (let cat in categorias) {
                let producto = categorias[cat].find(p => p.nombre === item.nombre);
                if (producto) {
                    producto.inventario += item.cantidad;
                }
            }
        });

        cart = [];
        total = 0;
        actualizarTotalPantalla();
        renderProducts();
        renderCartItems();
        mostrarNotificacion("Carrito vaciado", "info");
    }
}

// Funciones del modal
function abrirModalCarrito() {
    cartModal.classList.add('active');
    renderCartItems();
    actualizarTotalPantalla();
}

function cerrarModalCarrito() {
    cartModal.classList.remove('active');
}

// Renderizar items del carrito en el modal
function renderCartItems() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #718096;">
                🛒 Tu carrito está vacío
                <br>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="cerrarModalCarrito()">
                    Continuar comprando
                </button>
            </div>
        `;
        return;
    }

    let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach((item, index) => {
        html += `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio}</td>
                <td>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="actualizarCantidad(${index}, -1)">-</button>
                        <span class="quantity-input">${item.cantidad}</span>
                        <button class="quantity-btn" onclick="actualizarCantidad(${index}, 1)">+</button>
                    </div>
                </td>
                <td>$${item.subtotal}</td>
                <td>
                    <button class="btn-delete" onclick="eliminarDelCarrito(${index})" title="Eliminar">×</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    cartItemsContainer.innerHTML = html;
    modalCartTotalElement.innerText = total;
}

// Actualizar cantidad en el carrito
function actualizarCantidad(index, cambio) {
    let item = cart[index];
    let nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(index);
        return;
    }

    for (let cat in categorias) {
        let producto = categorias[cat].find(p => p.nombre === item.nombre);
        if (producto) {
            if (nuevaCantidad > (producto.inventario + item.cantidad)) {
                mostrarNotificacion("No hay suficiente inventario", "error");
                return;
            }
            
            producto.inventario += (item.cantidad - nuevaCantidad);
            break;
        }
    }

    total += item.precio * cambio;
    item.cantidad = nuevaCantidad;
    item.subtotal = item.precio * nuevaCantidad;

    actualizarTotalPantalla();
    renderProducts();
    renderCartItems();
    mostrarNotificacion("Cantidad actualizada", "info");
}

// Eliminar del carrito
function eliminarDelCarrito(index) {
    let item = cart[index];
    
    for (let cat in categorias) {
        let producto = categorias[cat].find(p => p.nombre === item.nombre);
        if (producto) {
            producto.inventario += item.cantidad;
            break;
        }
    }

    total -= item.subtotal;
    cart.splice(index, 1);

    actualizarTotalPantalla();
    renderProducts();
    renderCartItems();
    mostrarNotificacion("Producto eliminado del carrito", "info");
}

// Métodos de pago
function seleccionarPago(metodo, element) {
    metodoPagoSeleccionado = metodo;
    
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');

    if (metodo === 'paypal') {
        paypalButtonContainer.style.display = 'block';
    } else {
        paypalButtonContainer.style.display = 'none';
    }

    mostrarNotificacion(`Método de pago seleccionado: ${metodo}`, 'info');
}

// Inicializar PayPal
function inicializarPayPal() {
    if (window.paypal) {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal'
            },
            createOrder: function(data, actions) {
                if (cart.length === 0) {
                    mostrarNotificacion("El carrito está vacío", "error");
                    return;
                }
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toString()
                        },
                        description: 'Compra en Veterinaria'
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    procesarPagoExitoso('paypal', details);
                });
            },
            onError: function(err) {
                mostrarNotificacion("Error en el pago con PayPal", "error");
                console.error('PayPal Error:', err);
            }
        }).render('#paypal-button-container');
    }
}

// Procesar pago
function procesarPago() {
    if (cart.length === 0) {
        mostrarNotificacion("El carrito está vacío", "error");
        return;
    }

    if (metodoPagoSeleccionado === 'paypal') {
        return;
    }

    procesarPagoExitoso(metodoPagoSeleccionado);
}

function procesarPagoExitoso(metodo, detalles = null) {
    let ticket = generateTicket(metodo, detalles);
    
    alert(ticket);
    
    cart = [];
    total = 0;
    
    actualizarTotalPantalla();
    renderProducts();
    renderCartItems();
    cerrarModalCarrito();
    
    mostrarNotificacion(`¡Compra exitosa! Pago con ${metodo}`, 'success');
}

function generateTicket(metodo, detalles) {
    const fecha = new Date().toLocaleString();
    let ticket = "═══════════════════════════════\n";
    ticket += "        TICKET DE COMPRA        \n";
    ticket += "         VETERINARIA 🐾         \n";
    ticket += "═══════════════════════════════\n\n";
    ticket += `Fecha: ${fecha}\n`;
    ticket += `Método de pago: ${metodo}\n\n`;
    ticket += "Productos:\n";
    ticket += "───────────────────────────────\n";
    
    cart.forEach(item => {
        ticket += `${item.nombre}\n`;
        ticket += `${item.cantidad} x $${item.precio} = $${item.subtotal}\n\n`;
    });
    
    ticket += "───────────────────────────────\n";
    ticket += `TOTAL: $${total}\n`;
    ticket += "═══════════════════════════════\n";
    ticket += "¡Gracias por su compra!\n";
    ticket += "Vuelva pronto 🐶🐱\n";
    
    return ticket;
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    if (event.target === cartModal) {
        cerrarModalCarrito();
    }
};