let carrito = [];
let total = 0;
let edadUsuario = null;

let bebidas = [];

//Load data asynchronously using fetch
async function cargarDatos() {
    try {
        const response = await fetch('./datos.json');
        const data = await response.json();
        bebidas = data.bebidas;
    } catch (error) {
        console.error('Error al cargar datos:', error.message);
        mostrarMensaje('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
    }

    // Load age data from localStorage if available
    if (localStorage.getItem("edad")) {
        edadUsuario = parseInt(localStorage.getItem("edad"));
        ocultarVerificacionEdad();
    } else {
        // Show age verification modal
        $('#verificarEdadModal').modal('show');
    }

    // Confirm age from the modal
    document.getElementById("confirmarEdadBtn").addEventListener("click", function () {
        let edad = parseInt(document.getElementById("edadInput").value);
        if (isNaN(edad)) {
            mostrarMensaje("Por favor, ingresa un valor numérico válido.");
            return;
        }
        if (edad >= 18) {
            edadUsuario = edad;
            ocultarVerificacionEdad();
            mostrarOpciones();
            $('#verificarEdadModal').modal('hide');
            // Save age to localStorage
            localStorage.setItem("edad", edad.toString());
        } else {
            mostrarMensaje("Lo siento, debes ser mayor de 18 años para acceder a esta tienda.");
        }
    });

    // Load cart data from localStorage if available
    if (localStorage.getItem("cart")) {
        carrito = JSON.parse(localStorage.getItem("cart"));
        total = parseFloat(localStorage.getItem("total"));
        actualizarCarrito();
    }

    // Show options after loading data and verifying age
    mostrarOpciones();
}

function ocultarVerificacionEdad() {
    document.getElementById("verificarEdadBtn").style.display = "none";
    document.getElementById("edadText").style.display = "none";
}

function mostrarMensaje(mensaje) {
    let mensajeDiv = document.createElement("div");
    mensajeDiv.innerHTML = mensaje;
    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(mensajeDiv);
}

function mostrarBebidas() {
    let listaBebidas = "Lista de bebidas disponibles:<br>";
    for (let i = 0; i < bebidas.length; i++) {
        listaBebidas += `${i + 1}. ${bebidas[i].nombre} - $${bebidas[i].precio.toFixed(2)}.<br>`;
    }
    mostrarMensaje(listaBebidas);
    mostrarBotonAtras();
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
        mostrarBotonAtras();
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
        mostrarBotonAtras();
    });

    document.getElementById("output").innerHTML = "";
    document.getElementById("output").appendChild(precioInput);
    document.getElementById("output").appendChild(filtrarBtn);
}

function comenzarCompras() {
    if (edadUsuario === null) {
        mostrarMensaje("Por favor, verifica tu edad antes de comenzar las compras.");
        mostrarBotonAtras();
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
            mostrarBotonAtras();
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
    mostrarBotonAtras();
});

// Function to save cart data to localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem("cart", JSON.stringify(carrito));
    localStorage.setItem("total", total.toString());
}

// Initialize the cart display
actualizarCarrito();

// Function to show the back button
function mostrarBotonAtras() {
    let atrasBtn = document.createElement("button");
    atrasBtn.innerText = "Atrás";
    atrasBtn.addEventListener("click", function () {
        mostrarOpciones();
    });

    document.getElementById("output").appendChild(atrasBtn);
}

document.getElementById("finalizarCompraBtn").addEventListener("click", function () {
    finalizarCompra();
});

function finalizarCompra() {
   // Checkout logic, e.g. clear cart and display message
    carrito = [];
    total = 0;
    guardarCarritoEnStorage();
    actualizarCarrito();

    // Show message with Toastify
    Toastify({
        text: "¡Compra finalizada con éxito!",
        duration: 3000, // Message duration in milliseconds
        gravity: "top", // Message position (top, bottom, left, right)
        position: "center", // Message alignment (center, left, right)
        backgroundColor: "green", // Message background color
    }).showToast();
}
//Load data at startup
cargarDatos();