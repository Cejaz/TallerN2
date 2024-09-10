// Usuarios y contraseñas aceptadas
const usuariosValidos = {
    "Sebygranado@hotmail.com": {
        password: "Sebastian01",
        nombre: "Sebastián"
    },
    "Santiago@hotmail.com": {
        password: "Santiago01",
        nombre: "Santiago"
    },
    "Marcela@hotmail.com": {
        password: "Marcela01",
        nombre: "Marcela"
    }
};

// Función para cambiar la vista
function changeView(targetId) {
    const activeView = document.querySelector('.active-view');
    const targetView = document.getElementById(targetId);

    if (activeView !== targetView) {
        activeView.classList.remove('active-view');
        activeView.style.display = 'none';
        targetView.style.display = 'block';
        setTimeout(() => {
            targetView.classList.add('active-view');
        }, 20);
    }
}

// Manejo del login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (usuariosValidos[email] && usuariosValidos[email].password === password) {
        localStorage.setItem('usuarioLogueado', usuariosValidos[email].nombre);
        changeView('home-view');
    } else {
        alert('Credenciales incorrectas. Por favor, intente nuevamente.');
    }
});

// Navegación desde los botones del footer
document.querySelectorAll('.footer-button').forEach(button => {
    button.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        changeView(target);
    });
});

// Obtener el nombre del usuario almacenado en localStorage
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    // Mostrar el saludo en la página de inicio
    if (usuarioLogueado) {
        document.getElementById('greeting').innerText = `Hola, ${usuarioLogueado}`;
    } else {
        document.getElementById('greeting').innerText = 'Hola, Invitado';
    }
});

// Elementos del DOM para manejar la lógica de las vistas home y checkout
const roomList = document.querySelector('.room-list');
let platosPedidos = []; // Lista para almacenar los platos seleccionados

// Lógica para manejar la selección de habitaciones y reservas
document.querySelectorAll('.reserve-button').forEach(button => {
    button.addEventListener('click', function() {
        const roomItem = this.closest('.room-item');
        const reservationDetails = roomItem.querySelector('.reservation-details');
        reservationDetails.style.display = 'block'; // Mostrar la sección de detalles

        // Ocultar el botón de reservar para evitar múltiples expansiones
        this.style.display = 'none';

        const checkInDateInput = reservationDetails.querySelector('.date-input[id="checkInDate"]');
        const checkOutDateInput = reservationDetails.querySelector('.date-input[id="checkOutDate"]');
        const totalPriceElement = reservationDetails.querySelector('.total-price');
        const confirmReserveButton = reservationDetails.querySelector('.confirm-reserve-button');

        // Calcular el costo total al seleccionar las fechas
        checkInDateInput.addEventListener('change', calculateTotalPrice);
        checkOutDateInput.addEventListener('change', calculateTotalPrice);

        function calculateTotalPrice() {
            const checkInDate = new Date(checkInDateInput.value);
            const checkOutDate = new Date(checkOutDateInput.value);
            const pricePerNight = parseFloat(roomItem.querySelector('.room-info p:nth-child(2)').textContent.split('$')[1]);

            if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
                const timeDiff = checkOutDate - checkInDate;
                const daysDiff = timeDiff / (1000 * 3600 * 24); // Convertir de milisegundos a días
                const totalPrice = daysDiff * pricePerNight;
                totalPriceElement.textContent = totalPrice.toFixed(2);
            } else {
                totalPriceElement.textContent = '0';
            }
        }

        // Confirmar reserva y pasar a la selección de comidas
        confirmReserveButton.addEventListener('click', function() {
            const checkInDate = checkInDateInput.value;
            const checkOutDate = checkOutDateInput.value;
            if (!checkInDate || !checkOutDate) {
                alert('Por favor, seleccione ambas fechas.');
                return;
            }

            const totalPrice = parseFloat(totalPriceElement.textContent);
            const roomName = button.getAttribute('data-room');

            // Guardar los datos en localStorage
            localStorage.setItem('selectedRoom', roomName);
            localStorage.setItem('checkInDate', checkInDate);
            localStorage.setItem('checkOutDate', checkOutDate);
            localStorage.setItem('roomPrice', totalPrice);

            // Cambiar a la vista de comidas
            changeView('delivery-view');
        });
    });
});

// Lógica para manejar la selección de platos en la vista de comidas
document.querySelectorAll('.order-button').forEach(button => {
    button.addEventListener('click', function() {
        const dishItem = this.closest('.dish-item');
        const dishName = dishItem.querySelector('.dish-description h3').textContent;
        const dishPrice = parseFloat(dishItem.querySelector('.dish-description p:nth-child(3)').textContent.split('$')[1]);

        platosPedidos.push({ name: dishName, price: dishPrice });

        alert(`${dishName} añadido a la orden por $${dishPrice}`);
    });
});

// Función para calcular el total de los platos pedidos
function calcularTotalPlatos() {
    return platosPedidos.reduce((total, plato) => total + plato.price, 0).toFixed(2);
}

// Redirigir al checkout después de seleccionar los platos
document.getElementById('skip-to-checkout').addEventListener('click', function() {
    // Guardar el total de platos en localStorage
    const totalPlatos = calcularTotalPlatos();
    localStorage.setItem('totalPlatos', totalPlatos);

    // Actualizar la vista de checkout con los datos de la habitación y los platos
    const roomName = localStorage.getItem('selectedRoom');
    const checkInDate = localStorage.getItem('checkInDate');
    const checkOutDate = localStorage.getItem('checkOutDate');
    const roomPrice = parseFloat(localStorage.getItem('roomPrice'));
    const totalPrice = roomPrice + parseFloat(totalPlatos);

    localStorage.setItem('totalPrice', totalPrice.toFixed(2)); // Guardar el precio total en localStorage

    updateCheckoutView(roomName, checkInDate, checkOutDate, totalPrice);

    // Cambiar a la vista de checkout
    changeView('checkout-view');
});

// Función para actualizar la vista de checkout
function updateCheckoutView(roomName, checkInDate, checkOutDate, totalPrice) {
    document.getElementById('room-name').textContent = roomName || 'No seleccionado';
    document.getElementById('room-date').textContent = `${checkInDate} - ${checkOutDate}` || 'Fechas no seleccionadas';
    document.getElementById('price-value').textContent = totalPrice.toFixed(2) || '0.00';
}

// Redirigir a la pasarela de pago
document.getElementById('pay-button').addEventListener('click', function() {
    const selectedRoom = localStorage.getItem('selectedRoom');
    const checkInDate = localStorage.getItem('checkInDate');
    const checkOutDate = localStorage.getItem('checkOutDate');
    const totalPrice = localStorage.getItem('totalPrice');
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');

    if (selectedRoom && checkInDate && checkOutDate && totalPrice && usuarioLogueado) {
        alert(`Usuario: ${usuarioLogueado}\nHabitación: ${selectedRoom}\nFechas: ${checkInDate} a ${checkOutDate}\nPrecio: $${totalPrice}\nRedirigiendo a la pasarela de pago...`);
        // Aquí se podría redirigir a una pasarela de pago real

        // Volver a la vista de inicio después del pago
        changeView('home-view');
        platosPedidos = []; // Limpiar la lista de platos después del pago
    } else {
        alert('Hubo un error al procesar su solicitud. Por favor, intente nuevamente.');
    }
});

// Limpiar los campos de fecha al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los campos de fecha
    const dateInputs = document.querySelectorAll('.date-input');
    
    // Establecer el valor de cada campo de fecha a vacío
    dateInputs.forEach(input => {
        input.value = '';
    });

    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    // Mostrar el saludo en la página de inicio
    if (usuarioLogueado) {
        document.getElementById('greeting').innerText = `Hola, ${usuarioLogueado}`;
    } else {
        document.getElementById('greeting').innerText = 'Hola, Invitado';
    }
});
