let carrito = [];
let total = 0;
let edadUsuario = null;

let bebidas = [
    { nombre: "Cerveza", precio: 5.99 },
    { nombre: "Vino", precio: 12.99 },
    { nombre: "Whisky", precio: 29.99 }
];

// Load cart data from localStorage if available
if (localStorage.getItem("cart")) {
    carrito = JSON.parse(localStorage.getItem("cart"));
    total = parseFloat(localStorage.getItem("total"));
    actualizarCarrito();
}

document.getElementById("verificarEdadBtn").addEventListener("click", function () {
    if (edadUsuario === null) {
        let edadInput = document.createElement("input");
        edadInput.setAttribute("type", "number");
        edadInput.setAttribute("placeholder", "Ingresa tu edad");
        let confirmarBtn = document.createElement("button");
        confirmarBtn.innerText = "Confirmar";
        confirmarBtn.addEventListener("click", function () {
            let edad = parseInt(edadInput.value);

            if (isNaN(edad)) {
                mostrarMensaje("Por favor, ingresa un valor numérico válido.");
                return;
            }

            if (edad >= 18) {
                edadUsuario = edad;
                mostrarOpciones();
            } else {
                mostrarMensaje("Lo siento, debes ser mayor de 18 años para acceder a esta tienda.");
            }
        });

        document.getElementById("output").innerHTML = "";
        document.getElementById("output").appendChild(edadInput);
        document.getElementById("output").appendChild(confirmarBtn);
    } else {
        mostrarOpciones();
    }
});

function mostrarMensaje(mensaje) {
    let mensajeDiv = document.createElement("div");
    mensajeDiv.innerHTML = mensaje;
    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(mensajeDiv);
}

function mostrarOpciones() {
    let opcionesDiv = document.createElement("div");
    opcionesDiv.innerHTML = `
        <button id="mostrarBebidasBtn">Mostrar lista de bebidas</button>
        <button id="buscarBebidaBtn">Buscar bebida por nombre</button>
        <button id="filtrarBebidasBtn">Filtrar bebidas por precio</button>
        <button id="agregarAlCarritoBtn">Comprar Bebidas</button>
        <button id="salirBtn">Salir</button>
    `;

    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(opcionesDiv);

    // Event listeners for options
    document.getElementById("mostrarBebidasBtn").addEventListener("click", function () {
        mostrarBebidas();
    });

    document.getElementById("buscarBebidaBtn").addEventListener("click", function () {
        buscarBebida();
    });

    document.getElementById("filtrarBebidasBtn").addEventListener("click", function () {
        filtrarBebidas();
    });

    document.getElementById("agregarAlCarritoBtn").addEventListener("click", function () {
        comenzarCompras();
    });

    document.getElementById("salirBtn").addEventListener("click", function () {
        mostrarMensaje("Gracias por visitar la Tienda de Bebidas.");
    });
}

function mostrarBebidas() {
    let listaBebidas = "Lista de bebidas disponibles:<br>";
    for (let i = 0; i < bebidas.length; i++) {
        listaBebidas += `${i + 1}. ${bebidas[i].nombre} - $${bebidas[i].precio.toFixed(2)}.<br>`;
    }
    mostrarMensaje(listaBebidas);
}

function buscarBebida() {
    let nombreInput = document.createElement("input");
    nombreInput.setAttribute("type", "text");
    nombreInput.setAttribute("placeholder", "Ingresa el nombre de la bebida");
    let buscarBtn = document.createElement("button");
    buscarBtn.innerText = "Buscar";
    buscarBtn.addEventListener("click", function () {
        let nombreBuscado = nombreInput.value.trim().toLowerCase();

        if (nombreBuscado === "") {
            mostrarMensaje("Por favor, ingresa un nombre de bebida.");
            return;
        }

        let bebidaEncontrada = bebidas.find(bebida => bebida.nombre.toLowerCase() === nombreBuscado);

        if (bebidaEncontrada) {
            mostrarMensaje(`${bebidaEncontrada.nombre} - $${bebidaEncontrada.precio.toFixed(2)}`);
        } else {
            mostrarMensaje("No se encontró la bebida.");
        }
    });

    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(nombreInput);
    document.getElementById("output").appendChild(buscarBtn);
}

function filtrarBebidas() {
    let precioInput = document.createElement("input");
    precioInput.setAttribute("type", "number");
    precioInput.setAttribute("placeholder", "Precio máximo");
    let filtrarBtn = document.createElement("button");
    filtrarBtn.innerText = "Filtrar";
    filtrarBtn.addEventListener("click", function () {
        let precioMaximo = parseFloat(precioInput.value);

        if (isNaN(precioMaximo)) {
            mostrarMensaje("Por favor, ingresa un valor numérico válido.");
            return;
        }

        let bebidasFiltradas = bebidas.filter(bebida => bebida.precio <= precioMaximo);
        let listaFiltrada = "Bebidas filtradas por precio:<br>";
        bebidasFiltradas.forEach(bebida => {
            listaFiltrada += `${bebida.nombre} - $${bebida.precio.toFixed(2)}.<br>`;
        });
        mostrarMensaje(listaFiltrada);
    });

    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(precioInput);
    document.getElementById("output").appendChild(filtrarBtn);
}

function comenzarCompras() {
    if (edadUsuario === null) {
        mostrarMensaje("Por favor, verifica tu edad antes de comenzar las compras.");
    } else {
        let opcionesDiv = document.createElement("div");
        opcionesDiv.innerHTML = `
            <select id="bebidaSeleccionada">
                ${bebidas.map((bebida, index) => `<option value="${index}">${bebida.nombre} - $${bebida.precio.toFixed(2)}</option>`).join('')}
            </select>
            <button id="agregarAlCarritoBtn">Agregar al Carrito</button>
        `;

        document.getElementById("output").innerHTML = "";
        document.getElementById("output").appendChild(opcionesDiv);

        // Event listener to add selected item to cart
        document.getElementById("agregarAlCarritoBtn").addEventListener("click", function () {
            let opcion = document.getElementById("bebidaSeleccionada").value;
            let seleccion = bebidas[opcion];
            carrito.push(seleccion);
            total += seleccion.precio;
            guardarCarritoEnStorage();
            actualizarCarrito();
            mostrarMensaje(`${seleccion.nombre} ha sido añadido al carrito.`);
        });
    }
}

function actualizarCarrito() {
    let carritoHtml = "";
    for (let i = 0; i < carrito.length; i++) {
        carritoHtml += `${i + 1}. ${carrito[i].nombre} - $${carrito[i].precio.toFixed(2)}<br>`;
    }
    document.getElementById("cart-items").innerHTML = carritoHtml;
    document.getElementById("cart-total").textContent = total.toFixed(2);
    document.getElementById("carrito").style.display = "block";
}

document.getElementById("reestablecerBtn").addEventListener("click", function () {
    carrito = [];
    total = 0;
    guardarCarritoEnStorage();
    actualizarCarrito();
    mostrarMensaje("El carrito de compras ha sido reestablecido.");
});

// Function to save cart data to localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem("cart", JSON.stringify(carrito));
    localStorage.setItem("total", total.toString());
}

// Initialize the cart display
actualizarCarrito();