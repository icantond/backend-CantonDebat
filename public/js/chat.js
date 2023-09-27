const socket = io();

const getUsername = async () => {
    const { value: username } = await Swal.fire({
        title: 'Ingrese su nombre de usuario',
        input: 'text',
        inputLabel: 'Nombre de usuario',
        inputPlaceholder: 'Ingrese su nombre de usuario',
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Debe ingresar un nombre de usuario';
            }
        },
    });

    if (username) {
        user = username;
        socket.emit('chatMessage', { user, message: 'se ha conectado al chat.' });
    }
};
getUsername();

const chatForm = document.getElementById('chat-form');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = document.getElementById('message').value;

    if(message){
    socket.emit('chatMessage', { user, message });
    document.getElementById('message').value = '';}
});

socket.on('message', (data) => {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${data.user}:</strong> ${data.message}`;
    messagesContainer.appendChild(messageElement);
});

socket.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('messageHistory', messageHistory);

    socket.on('chatMessage', (data) => {
        messageHistory.push(data);

        io.emit('message', data);
    });
});
