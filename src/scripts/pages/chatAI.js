document.addEventListener("DOMContentLoaded", async () => {
    const chatContainer = document.getElementById("chatContainer");
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
  
    // Load user session from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Sesi tidak valid. Silakan login kembali.");
      window.location.href = "login.html";
      return;
    }
  
    // Update welcome message time only once when the page loads
    const welcomeTimeElement = document.getElementById("welcomeTime");
    if (welcomeTimeElement.textContent.trim() === "12:00") {
      const currentTime = new Date();
      const formattedTime = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
      welcomeTimeElement.textContent = formattedTime;
    }
  
    // Function to format time as HH:MM
    function formatTime(date) {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
  
    // Function to process AI response
    function processMessage(message) {
      // Replace \n with <br> for line breaks
      let processedMessage = message.replace(/\n/g, "<br>");
  
      // Add bold formatting for **text**
      processedMessage = processedMessage.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
      return processedMessage;
    }
  
    // Function to add a message to the chat container
    function addMessage(message, isUser = false) {
      const messageDiv = document.createElement("div");
      messageDiv.className = isUser ? "flex justify-end" : "flex justify-start";
  
      // Get current time
      const currentTime = formatTime(new Date());
  
      // Process message for formatting
      const processedMessage = isUser ? message : processMessage(message);
  
      messageDiv.innerHTML = `
        <div class="${isUser ? 'bg-lime-300' : 'bg-lime-200'} p-4 rounded-lg inline-block max-w-lg text-sm border border-black">
          ${processedMessage}
          <div class="text-xs text-neutral-06 mt-1 text-right">${currentTime}</div>
        </div>
      `;
      chatContainer.appendChild(messageDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  
    // Handle form submission
    chatForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const userMessage = userInput.value.trim();
      if (!userMessage) return;
  
      // Disable the submit button and clear input field
      sendButton.disabled = true;
      userInput.value = "";
  
      // Add user's message to the chat
      addMessage(userMessage, true);
  
      // Create a loading indicator below the user's message
      const loadingIndicator = document.createElement("div");
      loadingIndicator.className = "flex justify-start";
      loadingIndicator.innerHTML = `
        <div class="bg-lime-200 p-4 rounded-lg inline-block max-w-lg text-sm border border-black">
          <p class="text-neutral-07">Loading...</p>
        </div>
      `;
      chatContainer.appendChild(loadingIndicator);
      chatContainer.scrollTop = chatContainer.scrollHeight;
  
      try {
        // Send user message to backend
        const response = await fetch("api/chat/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            message: userMessage,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Gagal mengirim pesan.");
        }
  
        const data = await response.json();
  
        // Ensure response has "reply" field
        if (!data.reply) {
          throw new Error("Respon dari server tidak valid.");
        }
  
        // Remove the loading indicator
        chatContainer.removeChild(loadingIndicator);
  
        // Add AI's response to the chat
        addMessage(data.reply);
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Terjadi kesalahan saat mengirim pesan.");
  
        // Remove the loading indicator in case of error
        chatContainer.removeChild(loadingIndicator);
      } finally {
        // Re-enable the submit button
        sendButton.disabled = false;
      }
    });
  
    // Logout functionality for desktop
    const logoutButton = document.getElementById("logout-btn");
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  
    // Logout functionality for mobile
    const mobileLogoutButton = document.getElementById("mobile-logout-btn");
    mobileLogoutButton.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  });