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
const roomSelect = document.getElementById('roomSelect');
const selectedRoom = document.getElementById('selectedRoom');
const dateInput = document.getElementById('dateInput');
const openCalendar = document.getElementById('openCalendar');
const calendarContainer = document.getElementById('calendarContainer');
const calendar = document.getElementById('calendar');
const confirmDate = document.getElementById('confirmDate');

// Actualizar la habitación seleccionada al cambiar el selector
roomSelect.addEventListener('change', () => {
    selectedRoom.innerText = roomSelect.value;
});

// Mostrar el calendario al hacer clic en el botón de calendario
openCalendar.addEventListener('click', () => {
    calendarContainer.classList.toggle('calendar-hidden');
});

// Confirmar la fecha seleccionada y guardarla en localStorage
confirmDate.addEventListener('click', () => {
    const selectedDate = calendar.value;
    const selectedRoomValue = roomSelect.value;

    if (selectedDate) {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || {};

        if (reservas[selectedRoomValue] && reservas[selectedRoomValue][selectedDate]) {
            alert('Esta fecha ya está reservada.');
        } else {
            if (!reservas[selectedRoomValue]) {
                reservas[selectedRoomValue] = {};
            }
            reservas[selectedRoomValue][selectedDate] = localStorage.getItem('usuarioLogueado');
            localStorage.setItem('reservas', JSON.stringify(reservas));
            dateInput.value = selectedDate;
            alert('Reserva guardada exitosamente.');
            calendarContainer.classList.add('calendar-hidden');

            // Cambiar a la vista de checkout
            changeView('checkout-view');
        }
    }
});
