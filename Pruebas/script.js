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
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

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

// Lógica para manejar la selección de habitaciones y reservas
document.querySelectorAll('.reserve-button').forEach(button => {
    button.addEventListener('click', function() {
        const roomItem = this.closest('.room-item');
        const reservationDetails = roomItem.querySelector('.reservation-details');
        reservationDetails.style.display = 'block'; // Mostrar la sección de detalles

        // Ocultar el botón de reservar para evitar múltiples expansiones
        this.style.display = 'none';

        const checkInDateInput = reservationDetails.querySelector('#checkInDate');
        const checkOutDateInput = reservationDetails.querySelector('#checkOutDate');
        const totalPriceElement = reservationDetails.querySelector('.total-price');
        const confirmReserveButton = reservationDetails.querySelector('.confirm-reserve-button');

        // Calcular el costo total al seleccionar las fechas
        checkInDateInput.addEventListener('change', calculateTotalPrice);
        checkOutDateInput.addEventListener('change', calculateTotalPrice);

        // Confirmar reserva y pasar al checkout
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
            localStorage.setItem('totalPrice', totalPrice);

            // Cambiar a la vista de checkout
            changeView('checkout-view');
            updateCheckoutView(roomName, checkInDate, checkOutDate, totalPrice);
        });

        function calculateTotalPrice() {
            const checkInDate = new Date(checkInDateInput.value);
            const checkOutDate = new Date(checkOutDateInput.value);
            const pricePerNight = parseFloat(roomItem.querySelector('.room-info p:nth-child(3)').textContent.split('$')[1]);

            if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
                const timeDiff = checkOutDate - checkInDate;
                const daysDiff = timeDiff / (1000 * 3600 * 24); // Convertir de milisegundos a días
                const totalPrice = daysDiff * pricePerNight;
                totalPriceElement.textContent = totalPrice.toFixed(2);
            } else {
                totalPriceElement.textContent = '0';
            }
        }
    });
});

// Función para actualizar la vista de checkout
function updateCheckoutView(roomName, checkInDate, checkOutDate, totalPrice) {
    document.getElementById('room-name').textContent = roomName;
    document.getElementById('room-date').textContent = `${checkInDate} - ${checkOutDate}`;
    document.getElementById('price-value').textContent = totalPrice.toFixed(2);
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
    } else {
        alert('Hubo un error al procesar su solicitud. Por favor, intente nuevamente.');
    }
});

// Prevenir la reserva si ya existe una
document.addEventListener('DOMContentLoaded', () => {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || {};

    roomList.addEventListener('click', () => {
        const selectedRoomValue = localStorage.getItem('selectedRoom');
        if (reservas[selectedRoomValue]) {
            for (const [fecha, usuario] of Object.entries(reservas[selectedRoomValue])) {
                if (usuario === localStorage.getItem('usuarioLogueado')) {
                    dateInput.value = fecha;
                    break;
                }
            }
        } else {
            dateInput.value = '';
        }
    });
});
