let chatsData = [];

// Input button
document.getElementById('chatFileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  chatsData = JSON.parse(await file.text()); 

  localStorage.setItem('chats', JSON.stringify(chatsData, null, 2));

  displayChatList(chatsData); 
});

// Function to display people list
function displayChatList(chats) {
  const chatListDiv = document.getElementById('chatList');
  chatListDiv.innerHTML = '';

  for (const chat of chats) { 
    const chatItem = document.createElement('div');
    chatItem.textContent = chat.user.name;
    chatItem.setAttribute('data-id', chat.user.id); 
    chatItem.setAttribute('avatar', chat.user.avatar_url);
    chatItem.classList.add('chat-item');

    // Display chat history and mark as active chat
    chatItem.addEventListener('click', () => {
      const selectedChat = chatListDiv.querySelector('.selected');
      if (selectedChat) {
        selectedChat.classList.remove('selected');
      }
      chatItem.classList.add('selected');
      displayChatHistory(chat.messages, chat); 
    });

    chatListDiv.appendChild(chatItem);
  } 
}

//display user chats
function displayChatHistory(messages, chat) {
  const chatPanel = document.getElementById('chatPanel');
  chatPanel.innerHTML = '';

  for (const message of messages) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message.content + ' (' + formatTimestamp(message.timestamp) + ')';
    messageDiv.setAttribute('message-id', message.user_id);
    messageDiv.classList.add('message-item');

    if (message.user_id === parseInt(document.querySelector('.chat-item.selected').getAttribute('data-id'))) {
      messageDiv.classList.add('message-item-right');
    } else {
      messageDiv.classList.add('message-item-left');
    }
    chatPanel.appendChild(messageDiv);
  }
}

//export button
document.getElementById('exportButton').addEventListener('click', () => {
  const jsonData = JSON.stringify(chatsData, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });

  saveAs(blob, 'export.json');
});


//clear button
document.getElementById('clearButton').addEventListener('click', () => {
  const chatListDiv = document.getElementById('chatList');
  chatListDiv.innerHTML = '';

  const chatPanel = document.getElementById('chatPanel');
  chatPanel.innerHTML = '';

  const chatFileInput = document.getElementById('chatFileInput');
  chatFileInput.value = '';

  chatsData.length = 0;
  localStorage.removeItem('chats');
});

//Page Reload 
window.addEventListener("load", (event) => {
  const storedChatsData = localStorage.getItem('chats');
  displayChatHistory(storedChatsData);
  displayChatList(storedChatsData);
});

// Function to format the timestamp as hh:mm
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString().substr(11, 5);
}
