let stompClient = null;

function connect() {
  const socket = new SockJS("/chat");
  stompClient = Stomp.over(socket);

  stompClient.connect({}, function () {
    stompClient.subscribe("/topic/messages", function (message) {
      showMessage(JSON.parse(message.body));
    });
  });
}

function sendMessage(sender, content) {
  if (!stompClient) return;

  stompClient.send(
    "/app/send",
    {},
    JSON.stringify({ sender: sender, content: content })
  );
}

function showMessage(message) {
  const messages = document.getElementById("messages");
  const li = document.createElement("li");
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  const senderName = document.getElementById("sender").value;
  li.classList.add("message-item");
  li.classList.add(message.sender === senderName ? "self" : "other");

  li.innerHTML = `<span class="text">${message.sender}: ${message.content}</span>
                    <span class="time">${time}</span>`;
  messages.appendChild(li);

  // Scroll to bottom
  messages.scrollTop = messages.scrollHeight;
}

// Form submit
document.getElementById("chat-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const sender = document.getElementById("sender").value;
  const content = document.getElementById("message").value;
  if (content.trim() === "") return;
  sendMessage(sender, content);
  document.getElementById("message").value = "";
});

connect();
