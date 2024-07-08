const API_KEY = 'sk-proj-VXxeb1WgIIPZzrS51PgtT3BlbkFJuXxN526TjcmAJpRC4iTr';
const MODEL_NAME = 'gpt-3.5-turbo';
let chats = [];
let activeChat = null;

class Chat {
    constructor(id) {
        this.id = id;
        this.messages = [];
        this.createListItem();
    }

    createListItem() {
        const chatItems = document.getElementById('chat-items');
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.textContent = `Chat ${this.id + 1}`;
        chatItem.onclick = () => setActiveChat(this.id);
        chatItems.appendChild(chatItem);
    }

    addMessage(sender, message) {
        this.messages.push({ sender, message });
        if (activeChat === this.id) {
            this.renderMessage(sender, message);
        }
    }

    renderMessage(sender, message) {
        const chatContainer = document.getElementById('chat-container');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender.toLowerCase()}`;
        messageElement.innerHTML = `
            <div class="sender">${sender}</div>
            <div class="content">${message}</div>
        `;
        chatContainer.appendChild(messageElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    renderAllMessages() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.innerHTML = '';
        this.messages.forEach(msg => this.renderMessage(msg.sender, msg.message));
    }
}

function createNewChat() {
    const chatId = chats.length;
    const newChat = new Chat(chatId);
    chats.push(newChat);
    setActiveChat(chatId);
}

function setActiveChat(chatId) {
    activeChat = chatId;
    document.querySelectorAll('.chat-item').forEach((item, index) => {
        item.classList.toggle('active', index === chatId);
    });
    chats[activeChat].renderAllMessages();
}

async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const message = inputElement.value.trim();
    if (message && activeChat !== null) {
        chats[activeChat].addMessage('You', message);
        inputElement.value = '';

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [{ role: 'user', content: message }],
                }),
            });

            const data = await response.json();
            const reply = data.choices[0].message.content;
            chats[activeChat].addMessage('Model', reply);
        } catch (error) {
            console.error('Error:', error);
            chats[activeChat].addMessage('System', 'An error occurred while processing your request.');
        }
    }
}

document.getElementById('new-chat-btn').addEventListener('click', createNewChat);
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize
createNewChat();
