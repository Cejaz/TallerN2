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

// Manejo de la lógica de las vistas home y checkout

// Elementos del DOM
const roomList = document.querySelector('.room-list');
const dateInput = document.getElementById('dateInput');
const openCalendar = document.getElementById('openCalendar');
const calendarContainer = document.getElementById('calendarContainer');
const calendar = document.getElementById('calendar');
const confirmDate = document.getElementById('confirmDate');

// Lógica para manejar la selección de habitaciones y reservas
document.querySelectorAll('.reserve-button').forEach(button => {
    button.addEventListener('click', function() {
        const roomName = this.getAttribute('data-room');
        const usuarioLogueado = localStorage.getItem('usuarioLogueado');
        localStorage.setItem('selectedRoom', roomName);
        
        // Actualizar la vista para seleccionar la fecha
        changeView('checkout-view');
        document.getElementById('room-name').textContent = roomName;
    });
});

// Mostrar el calendario al hacer clic en el botón de calendario
openCalendar.addEventListener('click', () => {
    calendarContainer.classList.toggle('calendar-hidden');
});

// Confirmar la fecha seleccionada y guardarla en localStorage
confirmDate.addEventListener('click', () => {
    const selectedDate = calendar.value;
    const selectedRoom = localStorage.getItem('selectedRoom');
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    const reservas = JSON.parse(localStorage.getItem('reservas')) || {};

    if (selectedDate) {
        if (reservas[selectedRoom] && reservas[selectedRoom][selectedDate]) {
            alert('Esta fecha ya está reservada.');
        } else {
            if (!reservas[selectedRoom]) {
                reservas[selectedRoom] = {};
            }
            reservas[selectedRoom][selectedDate] = usuarioLogueado;
            localStorage.setItem('reservas', JSON.stringify(reservas));
            localStorage.setItem('selectedDate', selectedDate);
            alert('Reserva guardada exitosamente.');
            calendarContainer.classList.add('calendar-hidden');

            // Cambiar a la vista de pago
            updateCheckoutView(selectedRoom, selectedDate);
        }
    }
});

// Función para actualizar la vista de checkout
function updateCheckoutView(roomName, selectedDate) {
    const precios = {
        "Habitación 1": 100,
        "Habitación 2": 120,
        "Habitación 3": 140,
        "Habitación 4": 160,
        "Habitación 5": 180
    };
    const priceValue = precios[roomName] || 0;

    document.getElementById('room-name').textContent = roomName;
    document.getElementById('selected-date').textContent = selectedDate;
    document.getElementById('price-value').textContent = priceValue;

    localStorage.setItem('totalPrice', priceValue);
}

// Redirigir a la pasarela de pago
document.getElementById('pay-button').addEventListener('click', function() {
    const selectedRoom = localStorage.getItem('selectedRoom');
    const selectedDate = localStorage.getItem('selectedDate');
    const priceValue = localStorage.getItem('totalPrice');
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');

    if (selectedRoom && selectedDate && priceValue && usuarioLogueado) {
        alert(`Usuario: ${usuarioLogueado}\nHabitación: ${selectedRoom}\nFecha: ${selectedDate}\nPrecio: $${priceValue}\nRedirigiendo a la pasarela de pago...`);
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
