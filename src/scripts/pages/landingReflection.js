document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      console.error("User session not found.");
      return;
    }
    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  
    try {
      // Check if the user has submitted mood or reflection today
      const moodResponse = await fetch(
        `api/mood/check?user_id=${user.id}&date=${today}`
      );
      const reflectionResponse = await fetch(
        `api/reflection/check?user_id=${user.id}&date=${today}`
      );
  
      if (!moodResponse.ok || !reflectionResponse.ok) {
        throw new Error("Failed to check mood or reflection data.");
      }
  
      const moodData = await moodResponse.json();
      const reflectionData = await reflectionResponse.json();
  
      // If either mood or reflection exists, add ChatBot link to the navbar
      if (moodData.exists || reflectionData.exists) {
        addChatBotLinkToNavbar();
      }
    } catch (error) {
      console.error("Error checking mood or reflection:", error);
    }
  });
  
  function addChatBotLinkToNavbar() {
    // Add ChatBot link to desktop navbar
    const menuDesktop = document.getElementById("menu-desktop");
    if (menuDesktop) {
      const chatBotLink = document.createElement("a");
      chatBotLink.href = "chatAI.html";
      chatBotLink.textContent = "ChatBot";
      chatBotLink.classList.add("nav-link");
      menuDesktop.appendChild(chatBotLink);
    }
  
    // Add ChatBot link to mobile navbar
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      const chatBotLinkMobile = document.createElement("a");
      chatBotLinkMobile.href = "chatAI.html";
      chatBotLinkMobile.textContent = "ChatBot";
      chatBotLinkMobile.classList.add("text-lg", "font-medium", "text-neutral-09");
      mobileMenu.appendChild(chatBotLinkMobile);
    }
  }

      document.addEventListener("DOMContentLoaded", () => {
        // Retrieve user data from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
    
        // Check if the user is logged in
        if (!user) {
          // Redirect to index.html if not logged in
          window.location.href = "index.html";
        }
    
        // Add event listener for logout button (desktop)
        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
          logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
          });
        }
    
        // Add event listener for logout button (mobile)
        const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
        if (mobileLogoutBtn) {
          mobileLogoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
          });
        }
    
        // Add event listeners for hamburger menu
        const mobileMenuButton = document.getElementById("mobile-menu-button");
        const mobileMenu = document.getElementById("mobile-menu");
        const closeMobileMenuButton = document.getElementById("close-mobile-menu");
    
        if (mobileMenuButton && mobileMenu && closeMobileMenuButton) {
          mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.remove("hidden");
          });
    
          closeMobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
          });
        }
      });