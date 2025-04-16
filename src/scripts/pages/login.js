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

  // Main event listener for form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get input values
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic client-side validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      alert('Email dan password wajib diisi.');
      return;
    }

    if (!emailPattern.test(email)) {
      alert('Email tidak valid.');
      return;
    }

    if (password.length < 6) {
      alert('Password minimal 6 karakter.');
      return;
    }

    // Disable the submit button to prevent multiple submissions
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Memeriksa...';

    try {
      // Simulate sending login request to backend
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login gagal.');
      }

      const result = await response.json();

      // Save user data to localStorage as an object
      localStorage.setItem('user', JSON.stringify(result.user));

      // Show success message
      alert(result.message || 'Login berhasil!');

      // Redirect to home page
      window.location.href = 'index.html';
    } catch (error) {
      // Show error message
      alert(error.message || 'Terjadi kesalahan saat login.');
    } finally {
      // Re-enable the submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Masuk';
    }
  });
});