document.addEventListener("DOMContentLoaded", () => {
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
  
    // Validate session
    if (!user) {
      alert("Sesi tidak valid. Silakan login kembali.");
      window.location.href = "login.html";
      return;
    }
  
    // Populate form fields
    const userIdField = document.getElementById("userId");
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const birthdateField = document.getElementById("birthdate");
    const phoneField = document.getElementById("phone");
  
    if (userIdField) userIdField.textContent = user.id || "";
    if (usernameField) usernameField.value = user.username || user.email; // Fallback to email if username is not set
    if (emailField) emailField.value = user.email || "";
  
    // Handle birth date and phone number
    if (birthdateField) {
      if (user.birth_date) {
        birthdateField.value = user.birth_date;
        birthdateField.disabled = true; // Disable if already set
      } else {
        birthdateField.disabled = false; // Enable for input
      }
    }
  
    if (phoneField) {
      if (user.phone_number) {
        phoneField.value = user.phone_number;
        phoneField.disabled = true; // Disable if already set
      } else {
        phoneField.disabled = false; // Enable for input
      }
    }
  
    // Update sidebar username
    const sidebarUsername = document.getElementById("sidebar-username");
    if (sidebarUsername) {
      sidebarUsername.textContent = user.username || user.email;
    }
  
    // Fetch user profile from backend
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`api/auth/profile/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal memuat profil pengguna.");
        }
  
        const result = await response.json();
  
        // Update form fields with fetched data
        if (result.user) {
          const updatedUser = result.user;
          localStorage.setItem("user", JSON.stringify(updatedUser));
  
          if (usernameField) usernameField.value = updatedUser.username || updatedUser.email;
          if (emailField) emailField.value = updatedUser.email;
  
          // Handle birth date
          if (birthdateField) {
            if (updatedUser.birth_date) {
              birthdateField.value = updatedUser.birth_date;
              birthdateField.disabled = true; // Disable if already set
            } else {
              birthdateField.value = ""; // Clear field if null
              birthdateField.disabled = false; // Enable for input
            }
          }
  
          // Handle phone number
          if (phoneField) {
            if (updatedUser.phone_number) {
              phoneField.value = updatedUser.phone_number;
              phoneField.disabled = true; // Disable if already set
            } else {
              phoneField.value = ""; // Clear field if null
              phoneField.disabled = false; // Enable for input
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert(error.message || "Gagal memuat profil pengguna.");
      }
    };
  
    // Call fetchUserProfile on page load
    fetchUserProfile();
  
    // Function to update profile
    const updateProfile = async () => {
      // Collect form data
      const payload = {
        id: user.id,
        birth_date: birthdateField?.value || null,
        phone_number: phoneField?.value || null,
        new_password: document.getElementById("newPassword")?.value || null,
      };
  
      try {
        console.log("Updating profile with payload:", payload); // Debugging
  
        // Send update request to backend using fetch
        const response = await fetch("api/auth/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal memperbarui profil.");
        }
  
        const result = await response.json();
  
        // Update user data in localStorage
        const updatedUser = { ...user, ...payload };
        localStorage.setItem("user", JSON.stringify(updatedUser));
  
        alert(result.message || "Profil berhasil diperbarui.");
        location.reload(); // Reload page to reflect changes
      } catch (error) {
        console.error("Error updating profile:", error.message);
        alert(error.message || "Gagal memperbarui profil.");
      }
    };
  
    // Handle form submission
    const profileForm = document.getElementById("profileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await updateProfile();
      });
    }
  
    // Handle save button click
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", async () => {
        await updateProfile();
      });
    }
  
  // Add event listener for logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      // Remove user data from localStorage
      localStorage.removeItem('user');
  
      // Redirect to login page
      window.location.href = 'index.html';
    });
  } else {
    console.error("Logout button not found in the DOM.");
  }
  
    // Toggle password visibility
    document.querySelectorAll(".password-toggle").forEach((button) => {
      button.addEventListener("click", function () {
        const input = this.previousElementSibling;
        const icon = this.querySelector("svg");
  
        if (input.type === "password") {
          input.type = "text";
          icon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />';
        } else {
          input.type = "password";
          icon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />';
        }
      });
    });
  });