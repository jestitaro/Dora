document.addEventListener('DOMContentLoaded', function() {
    // Control del lightbox
    const doraAvatarButton = document.getElementById('dora-avatar-button');
    const chatLightbox = document.getElementById('chat-lightbox');

    doraAvatarButton.addEventListener('click', function() {
        chatLightbox.classList.add('active');
    });

    // Cerrar el lightbox al hacer clic fuera del contenedor del chat
    chatLightbox.addEventListener('click', function(e) {
        if (e.target === chatLightbox) {
            chatLightbox.classList.remove('active');
        }
    });

    // Eventos para enviar mensajes
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(sender, message) {
        const messagesDiv = document.getElementById('messages');
        const messageDiv = document.createElement('div');

        // Sanear y formatear el mensaje
        message = message.replace(/&/g, "&amp;")
                         .replace(/</g, "&lt;")
                         .replace(/>/g, "&gt;")
                         .replace(/\n/g, "<br>");

        const messageClass = sender === 'Usuario' ? 'user-message' : 'dora-message';

        messageDiv.classList.add('message', messageClass);

        if (sender === 'Dora') {
            // Estructura del mensaje de Dora con avatar
            messageDiv.innerHTML = `
                <div class="avatar">
                    <img src="/images/avatar-dora.png" alt="Avatar de Dora">
                </div>
                <div class="message-content">
                    ${message}
                </div>
            `;
        } else {
            // Estructura del mensaje del usuario sin avatar
            messageDiv.innerHTML = `
                <div class="message-content">
                    ${message}
                </div>
            `;
        }

        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function sendMessage() {
        const userInputElement = document.getElementById('user-input');
        const userInput = userInputElement.value;
        if (userInput.trim() === '') return;

        addMessage('Usuario', userInput);
        userInputElement.value = '';

        fetch('https://dora-i0tb1p2zj-jestitaros-projects.vercel.app', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            addMessage('Dora', data.reply);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
