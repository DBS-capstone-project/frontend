document.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  const authSection = document.querySelector('.flex.items-center.space-x-4.ml-4');
  const lacakBtnDesktop = document.querySelector('.nav-link[href="landingMood.html"]');
  const refleksiBtnDesktop = document.querySelector('.nav-link[href="landingReflection.html"]');

  // Validate that required elements exist in the DOM
  if (!authSection || !lacakBtnDesktop || !refleksiBtnDesktop) {
    console.error('One or more required elements are missing in the DOM.');
    return;
  }

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Function to update auth buttons in desktop navbar
  const updateDesktopAuthButtons = () => {
    if (user) {
      // User is logged in: Show Profile and Logout buttons
      authSection.innerHTML = `
        <a href="profile.html" class="text-neutral-09 px-6 py-1.5 border border-neutral-09 rounded-lg font-medium hover:bg-primary-02">Profile</a>
        <button id="logout-btn" class="bg-red-500 text-white px-6 py-1.5 border border-red-500 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200">Keluar</button>
      `;

      // Add event listener for logout button
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("user");
          window.location.href = "login.html";
        });
      }
    } else {
      // User is not logged in: Show Masuk and Daftar buttons
      authSection.innerHTML = `
        <a href="login.html" class="text-neutral-09 px-6 py-1.5 border border-neutral-09 rounded-lg font-medium hover:bg-primary-02">Masuk</a>
        <a href="emailConfirmation.html" class="bg-primary-04 px-6 py-1.5 border border-neutral-09 rounded-lg font-medium hover:bg-primary-02">Daftar</a>
      `;
    }
  };

  // Function to update auth buttons in mobile menu
  const updateMobileAuthButtons = () => {
    const authButtonsContainer = document.getElementById("auth-buttons");

    if (user) {
      // User is logged in: Show Profile and Logout buttons
      authButtonsContainer.innerHTML = `
        <a
          href="profile.html"
          class="w-1/2 text-lg text-center text-neutral-09 border border-neutral-09 py-2 rounded-lg font-medium hover:bg-neutral-100"
        >
          Profile
        </a>
        <button
          id="mobile-logout-btn"
          class="w-1/2 text-lg text-center text-white bg-red-500 border border-red-500 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
        >
          Keluar
        </button>
      `;

      // Add event listener for logout button
      const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
      if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", () => {
          localStorage.removeItem("user");
          window.location.href = "login.html";
        });
      }
    } else {
      // User is not logged in: Show Masuk and Daftar buttons
      authButtonsContainer.innerHTML = `
        <a
          href="login.html"
          class="w-1/2 text-lg text-center text-neutral-09 border border-neutral-09 py-2 rounded-lg font-medium hover:bg-neutral-100"
        >
          Masuk
        </a>
        <a
          href="emailConfirmation.html"
          class="w-1/2 text-lg text-center text-neutral-09 py-2 rounded-lg font-medium bg-primary-04 border border-neutral-09"
        >
          Daftar
        </a>
      `;
    }
  };

  // Protect Lacak Mood and Refleksi buttons for non-logged-in users
  const protectButtons = () => {
    if (!user) {
      // Protect desktop buttons
      lacakBtnDesktop.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Anda harus login terlebih dahulu.");
        window.location.href = "login.html";
      });

      refleksiBtnDesktop.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Anda harus login terlebih dahulu.");
        window.location.href = "login.html";
      });

      // Protect mobile buttons
      const lacakBtnMobile = document.querySelector("#mobile-menu a[href='landingMood.html']");
      const refleksiBtnMobile = document.querySelector("#mobile-menu a[href='landingReflection.html']");

      if (lacakBtnMobile) {
        lacakBtnMobile.addEventListener("click", (e) => {
          e.preventDefault();
          alert("Anda harus login terlebih dahulu.");
          window.location.href = "login.html";
        });
      }

      if (refleksiBtnMobile) {
        refleksiBtnMobile.addEventListener("click", (e) => {
          e.preventDefault();
          alert("Anda harus login terlebih dahulu.");
          window.location.href = "login.html";
        });
      }

      // Protect footer buttons
      const lacakBtnFooter = document.querySelector("#footer a[href='landingMood.html']");
      const refleksiBtnFooter = document.querySelector("#footer a[href='landingReflection.html']");

      if (lacakBtnFooter) {
        lacakBtnFooter.addEventListener("click", (e) => {
          e.preventDefault();
          alert("Anda harus login terlebih dahulu.");
          window.location.href = "login.html";
        });
      }

      if (refleksiBtnFooter) {
        refleksiBtnFooter.addEventListener("click", (e) => {
          e.preventDefault();
          alert("Anda harus login terlebih dahulu.");
          window.location.href = "login.html";
        });
      }
    }
  };

  // Update auth buttons and protect buttons on page load
  updateDesktopAuthButtons();
  updateMobileAuthButtons();
  protectButtons();

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

