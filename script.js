const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");
const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/";
let socket;
let reconnectTimeout;

// Function to display notifications on the UI
const displayNotification = (message) => {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;
  notificationsDiv.appendChild(notification);
};

// Function to connect to the WebSocket server
const connectWebSocket = () => {
  socket = new WebSocket(wsUrl);

  // WebSocket connected successfully
  socket.addEventListener("open", () => {
    console.log("Connected to WebSocket server");
    statusDiv.textContent = "Connected";
    messageInput.disabled = false;
    sendButton.disabled = false;
    disconnectButton.disabled = false;

    // Clear any existing reconnect attempts
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
  });

  // WebSocket message received
  socket.addEventListener("message", (event) => {
    console.log("Received message:", event.data);
    displayNotification(event.data);
  });

  // WebSocket closed (either by server or manually)
  socket.addEventListener("close", () => {
    console.log("Disconnected from WebSocket server");
    statusDiv.textContent = "Disconnected";
    messageInput.disabled = true;
    sendButton.disabled = true;
    disconnectButton.disabled = true;

    // Attempt to reconnect after 10 seconds
    reconnectTimeout = setTimeout(() => {
      console.log("Attempting to reconnect...");
      statusDiv.textContent = "Reconnecting...";
      connectWebSocket();
    }, 10000);
  });

  // WebSocket error occurred
  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
    socket.close(); // Close the connection on error
  });
};

// Send message to WebSocket server
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    messageInput.value = ""; // Clear input field after sending
  }
});

// Disconnect from WebSocket server
disconnectButton.addEventListener("click", () => {
  if (socket) {
    socket.close();
    console.log("Manually disconnected from WebSocket server");
  }
});

// Connect to WebSocket server initially
connectWebSocket();
