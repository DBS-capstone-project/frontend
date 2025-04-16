document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form'); // Menggunakan querySelector karena form tidak memiliki ID
  const passwordInput = document.getElementById('password');

  // Toggle Password Visibility
  const togglePasswordButton = document.createElement('button');
  togglePasswordButton.type = 'button';
  togglePasswordButton.classList.add(
    'absolute',
    'right-3',
    'top-1/2',
    'transform',
    '-translate-y-1/2',
    'text-neutral-09',
    'focus:outline-none'
  );
  togglePasswordButton.innerHTML = '<i class="fas fa-eye-slash"></i>';

  const passwordFieldWrapper = passwordInput.parentElement;
  passwordFieldWrapper.appendChild(togglePasswordButton);

  togglePasswordButton.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = togglePasswordButton.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });

  // Helper function to handle API requests
  const registerUser = async (userData) => {
    try {
      const response = await fetch('api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat akun.');
      }

      return await response.json(); // Return success message or data
    } catch (error) {
      console.error('Error during signup:', error);
      throw error; // Re-throw the error for handling in the main function
    }
  };

  // Main event listener for form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const usernameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic client-side validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || !email || !password) {
      alert('Semua field wajib diisi.');
      return;
    }

    if (!emailPattern.test(email)) {
      alert('Email tidak valid. Gunakan format yang benar.');
      return;
    }

    if (password.length < 6) {
      alert('Password minimal 6 karakter.');
      return;
    }

    // Disable the submit button to prevent multiple submissions
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Membuat Akun...';

    try {
      // Send signup request to backend
      const result = await registerUser({ username, email, password });

      // Show success message
      alert(result.message || 'Akun berhasil dibuat! Silakan login.');

      // Redirect to login page
      window.location.href = 'login.html';
    } catch (error) {
      // Show error message
      alert(error.message || 'Terjadi kesalahan saat signup.');
    } finally {
      // Re-enable the submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Buat Akun';
    }
  });
});