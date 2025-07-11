const productos = [
    {
        id: "01",
        imagen: "./img/mix1.jpg",
        nombre: "Mix Frutos secos",
        precio: 10000
    },
    {
        id: "02",
        imagen: "img/mix2.jpg",
        nombre: "Mix Cervecero",
        precio: 10000
    },
    {
        id: "03",
        imagen: "img/ban-des.jpg",
        nombre: "Banana desecada",
        precio: 5000
    },
    {
        id: "04",
        imagen: "img/pasas-uva.jpg",
        nombre: "Pasas de uva",
        precio: 4000
    },
    {
        id: "05",
        imagen: "img/copo-maiz.jpg",
        nombre: "Copos de Maíz",
        precio: 3000
    },
    {
        id: "06",
        imagen: "img/arito-frutal.jpg",
        nombre: "Arito frutal",
        precio: 4000
    },
    {
        id: "07",
        imagen: "img/alm1.jpg",
        nombre: "Almohaditas",
        precio: 5000
    },
    {
        id: "08",
        imagen: "img/fibra.jpg",
        nombre: "Fibra Granix",
        precio: 7000
    },

];

// Array para almacenar productos
let carrito = [];

function agregarProductoAlCarrito(idProducto) {
    // Buscar si el producto ya esta en el carrito
    let productoEnCarrito = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            productoEnCarrito = carrito[i];
            break; //salimos del bucle si se encontro el prod
        }
    }
    if (productoEnCarrito) {
        // Si el producto ya está, incrementar la cantidad
        productoEnCarrito++;
    } else {
        // Si no esta, buscar el prodcuto en el array "productos" original
        let productoOriginal = null;
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].id === idProducto) {
                productoOriginal = productos[i];
                break; // salir
            }
        }
        if (productoOriginal) {
            // Añadir el producto al carrito con cantidad 1
            carrito.push({ ...productoOriginal, cantidad: 1 });
        }
        actualizarCarritoHTML(); // Actualiza vista del carrito
    }
}
//----------------------------------------------------------------
// Manejo de los eventos clic
function manejarClicComprar(evento) {
    if (evento.target.classList.contains("btn-comprar")) {
        const productoId = evento.target.dataset.id;
        agregarProductoAlCarrito(productoId);
    }
}
//----------------------------------------------------------------
// Agrega los productos del array productos al DOM
function agregarProductos() {
    const divProductos = document.querySelector(".productos");
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        divProductos.insertAdjacentHTML("afterbegin",
            `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-contenido">
                    <h4>${producto.nombre}</h4>
                    <span class="producto-id">Código: ${producto.id}</span>
                    <span class="producto-precio">Precio: $ ${producto.precio}</span>
                    <button class="btn-comprar" type="button" data-id="${producto.id}">Comprar</button>
                </div>
            </div>
            `
        );
    }
    // Se delega eventos para los botones "comprar"
    divProductos.addEventListener("click", manejarClicComprar);
}
//----------------------------------------------------------------
// Maneja el evento de clic en los botones de cantidad y eliminar del carrito.
function manejarClicCarrito(evento) {
    const target = evento.target;

    if (target.classList.contains("btn-cantidad") || target.classList.contains("btn-eliminar")) {
        const productoId = target.dataset.id;
        const accion = target.dataset.action;

        if (accion === "eliminar") {
            eliminarProductoDelCarrito(productoId);
        } else if (accion === "restar") {
            restarCantidadProducto(productoId);
        } else if (accion === "sumar") {
            sumarCantidadProducto(productoId);
        }
    }
}
//----------------------------------------------------------------
function actualizarCarritoHTML() {
    const carritoCompras = document.querySelector(".carritoCompras");
    if (!carritoCompras) {
        console.error("Error: No se encontró el contenedor con la clase 'carritoCompras'. Asegurate de que exista en tu html.");
        return;
    }

    // Limpiar el contenedor actual del carrito y recrear la estructura base
    carritoCompras.innerHTML = `
        <h2>Tu Carrito de Compras</h2>
        <ul class="lista-carrito"></ul>
        <p class="total-carrito"></p>
        <p class="cantidad-carrito"></p>
        `;
    const listaCarrito = carritoCompras.querySelector(".lista-carrito");
    let totalPagar = 0;
    let cantidadProductosUnicos = 0;
    // verificar si el carrito esta vacio
    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>El carrito esta vacio.</p>";
    } else {
        // Usando un bucle for tradicional en lugar de forEach
        for (let i = 0; i < carrito.length; i++) {
            const item = carrito[i];
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
                <div>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="restar">-</button>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="sumar">+</button>
                    <button class="btn-eliminar" data-id="${item.id}" data-action="eliminar">x</button>
                </div>
            `;
            listaCarrito.appendChild(li);
            totalPagar += item.precio * item.cantidad;
            cantidadProductosUnicos++;
        }
    }
    // Mostrar el total a pagar y la cantidad de productos
    carritoCompras.querySelector(".total-carrito").textContent = `Total a pagar: $${totalPagar}`;
    carritoCompras.querySelector(".cantidad-carrito").textContent = `Productos en carrito: ${cantidadProductosUnicos}`;

    // Configurar el Event Listener para los botones de cantidad y eliminar
    const nuevoListaCarrito = carritoCompras.querySelector(".lista-carrito");
    nuevoListaCarrito.addEventListener("click", manejarClicCarrito);
}
//----------------------------------------------------------------
// Suma una unidad a la cantidad de un producto en el carrito.
function sumarCantidadProducto(idProducto) {
    let productoEnCarrito = null;

    // Buscar el producto en el carrito
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            productoEnCarrito = carrito[i];
            break;
        }
    }

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        actualizarCarritoHTML(); // Actualizar la vista
    }
}
//----------------------------------------------------------------
// Resta una unidad a la cantidad de un producto en el carrito.
function restarCantidadProducto(idProducto) {
    let productoEnCarrito = null;
    // Buscar el producto en el carrito
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto) {
            productoEnCarrito = carrito[i];
            break;
        }
    }

    if (productoEnCarrito) {
        productoEnCarrito.cantidad--;
        if (productoEnCarrito.cantidad <= 0) {
            eliminarProductoDelCarrito(idProducto); // Eliminar si la cantidad llega a 0
        } else {
            actualizarCarritoHTML(); // Solo actualizar si la cantidad aún es positiva
        }
    }
}
//----------------------------------------------------------------
// Elimina completamente un producto del carrito.
function eliminarProductoDelCarrito(idProducto) {
    // Reconstruir el array carrito sin el producto a eliminar
    const nuevoCarrito = [];
    for (let i = 0; i < carrito.length; i++) {
        // Buscar los elementos distintos al que hay que eliminar
        if (carrito[i].id !== idProducto) {
            nuevoCarrito.push(carrito[i]);
        }
    }
    carrito = nuevoCarrito;
    actualizarCarritoHTML();
}

// Inicializar la aplicación
agregarProductos();
actualizarCarritoHTML(); // Llamar al inicio para mostrar el carrito vacío si no hay productos
