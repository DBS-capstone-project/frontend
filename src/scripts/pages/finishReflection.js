document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Sesi tidak valid. Silakan login kembali.");
      window.location.href = "login.html";
      return;
    }
  
    const userId = user.id;
  
    try {
      // Fetch reflection data from the backend
      const response = await fetch(`api/mood/reflection-feedback?user_id=${userId}`);
      if (!response.ok) {
        throw new Error("Gagal mendapatkan feedback dari backend.");
      }
  
      const result = await response.json();
  
      // Display feedback in the DOM
      const feedbackMessage = document.getElementById("feedback-message");
      if (result.refleksi) {
        // Format teks refleksi: Ubah \n menjadi <br> dan **teks** menjadi bold
        const formattedReflection = result.refleksi
          .replace(/\n/g, "<br>") // Ganti newline dengan <br>
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Ganti **teks** dengan <strong>teks</strong>
  
        feedbackMessage.innerHTML = formattedReflection; // Gunakan innerHTML untuk rendering HTML
      } else {
        feedbackMessage.textContent = "Tidak ada refleksi tersedia.";
      }
    } catch (error) {
      console.error("Error fetching reflection:", error);
      const feedbackMessage = document.getElementById("feedback-message");
      feedbackMessage.textContent = "Terjadi kesalahan saat memuat refleksi.";
    }
  });