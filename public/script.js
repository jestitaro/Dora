document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function addMessage(sender, message) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');

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
                <img src="img/dora.jpeg" alt="Avatar de Dora">
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
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    addMessage('Usuario', userInput);
    document.getElementById('user-input').value = '';

    fetch('/api/chat', {
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