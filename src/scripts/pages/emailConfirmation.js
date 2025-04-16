document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form'); // Menggunakan querySelector karena form tidak memiliki ID
  const emailInput = document.getElementById('email');
  const messageDiv = document.createElement('div'); // Membuat elemen pesan dinamis

  // Menambahkan elemen pesan ke DOM
  messageDiv.id = 'message';
  messageDiv.classList.add('hidden', 'text-sm', 'mt-4', 'text-center');
  form.appendChild(messageDiv);

  // Helper function to handle API requests
  const registerUser = async (email) => {
    try {
      const response = await fetch('api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Terjadi kesalahan saat mendaftarkan pengguna.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw new Error(error.message || 'Terjadi kesalahan saat mendaftarkan pengguna.');
    }
  };

  // Main event listener for form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.classList.add('hidden');

    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!emailPattern.test(email)) {
      messageDiv.textContent = 'Silakan masukkan alamat email yang valid.';
      messageDiv.classList.remove('hidden');
      messageDiv.classList.add('text-red-600');
      return;
    }

    // Disable the submit button to prevent multiple submissions
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Mendaftarkan...';

    try {
      // Send registration request to backend
      const result = await registerUser(email);

      // Show success message
      messageDiv.textContent =
        `Pengguna berhasil didaftarkan. Silakan cek Gmail Anda untuk verifikasi.`;
      messageDiv.classList.remove('hidden');
      messageDiv.classList.add('text-green-600');
    } catch (error) {
      // Show error message from backend or fallback message
      messageDiv.textContent = error.message || 'Terjadi kesalahan, coba lagi nanti.';
      messageDiv.classList.remove('hidden');
      messageDiv.classList.add('text-red-600');
    } finally {
      // Re-enable the submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Daftarkan Pengguna';
    }
  });
});