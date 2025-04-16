document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Sesi tidak valid. Silakan login kembali.");
    window.location.href = "login.html";
    return;
  }

  const userId = user.id;

  // Ambil elemen-elemen dari DOM
  const feedbackMessage = document.getElementById("feedback-message");
  const loadingIndicator = document.getElementById("loading-indicator");

  // Pastikan elemen-elemen ada di DOM
  if (!feedbackMessage || !loadingIndicator) {
    console.error("Elemen feedback-message atau loading-indicator tidak ditemukan di DOM.");
    return;
  }

  try {
    // Tampilkan indikator loading
    feedbackMessage.style.display = "none"; // Sembunyikan pesan feedback
    loadingIndicator.style.display = "block"; // Tampilkan indikator loading

    // Fetch reflection data from the backend
    const response = await fetch(`api/mood/reflection-feedback?user_id=${userId}`);
    if (!response.ok) {
      throw new Error("Gagal mendapatkan feedback dari backend.");
    }

    const result = await response.json();

    // Sembunyikan indikator loading
    loadingIndicator.style.display = "none";

    // Tampilkan feedback di DOM
    if (result.refleksi) {
      // Format teks refleksi: Ubah \n menjadi <br> dan **teks** menjadi bold
      const formattedReflection = result.refleksi
        .replace(/\n/g, "<br>") // Ganti newline dengan <br>
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Ganti **teks** dengan <strong>teks</strong>

      feedbackMessage.innerHTML = formattedReflection; // Gunakan innerHTML untuk rendering HTML
      feedbackMessage.style.display = "block"; // Tampilkan pesan feedback
    } else {
      feedbackMessage.textContent = "Tidak ada refleksi tersedia.";
      feedbackMessage.style.display = "block"; // Tampilkan pesan feedback
    }
  } catch (error) {
    console.error("Error fetching reflection:", error);

    // Sembunyikan indikator loading jika terjadi error
    loadingIndicator.style.display = "none";

    // Tampilkan pesan error di DOM
    feedbackMessage.textContent = "Terjadi kesalahan saat memuat refleksi.";
    feedbackMessage.style.display = "block"; // Tampilkan pesan feedback
  }
});