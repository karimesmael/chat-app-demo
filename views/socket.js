var socket = io.connect("http://localhost:5000");

const messageContainer = document.getElementById("message-container");
const messageInput = document.getElementById("message-input");
const btn = document.getElementById("send-button");

const username = prompt("what is your name ?");
appendMessage("you connected");

socket.emit("new-user", username);

socket.on("new-msg", (data) => {
  appendMessage(`${data.username} : ${data.message}`);
});
socket.on("user-connected", (data) => {
  appendMessage(`${data} connected`);
});

socket.on("user-disconnect", (username) => {
  appendMessage(`${username} left the chat`);
});

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-message", message);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.appendChild(messageElement);
}