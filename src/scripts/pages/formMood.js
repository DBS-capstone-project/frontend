document.addEventListener("DOMContentLoaded", async () => {
  const dateInput = document.querySelector(".input-date-section input");
  const moodOptions = document.querySelectorAll(".mood-options .mood-item");
  const keywordButtons = document.querySelectorAll(".keyword-options .keyword-btn");
  const reasonInput = document.querySelector(".reason-mood-section textarea");
  const submitBtn = document.querySelector(".submit-section a");

  let selectedMood = null;
  let selectedKeyword = null;

  // Tanggal hari ini otomatis
  const today = new Date().toISOString().split("T")[0];
  dateInput.value = formatDateForDisplay(today); // Format tanggal untuk ditampilkan
  dateInput.disabled = true; // Nonaktifkan input tanggal

  // Validasi apakah pengguna sudah mengisi mood hari ini
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Sesi tidak valid. Silakan login kembali.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`api/mood/check?user_id=${user.id}&date=${today}`);
    if (!response.ok) {
      throw new Error("Gagal memeriksa data mood.");
    }

    const data = await response.json();
    if (data.exists) {
      alert("Kamu sudah mengisi mood hari ini. Coba lagi besok!");
      window.location.href = "landingMood.html";
      return;
    }
  } catch (error) {
    console.error("Error checking mood:", error);
    alert("Terjadi kesalahan saat memeriksa mood harian.");
    return;
  }

  // Mood selection
  moodOptions.forEach((option) => {
    option.addEventListener("click", () => {
      moodOptions.forEach((o) => o.classList.remove("border-2", "border-black", "bg-blue-100"));
      option.classList.add("border-2", "border-black", "bg-blue-100");
      selectedMood = option.dataset.mood; // Menggunakan dataset.mood
    });
  });

  // Keyword selection
  keywordButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      keywordButtons.forEach((b) => b.classList.remove("bg-lime-300", "border-black"));
      btn.classList.add("bg-lime-300", "border-black");
      selectedKeyword = btn.dataset.keyword; // Menggunakan dataset.keyword
    });
  });

  // Submit handler
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Mencegah perpindahan halaman default
    const reason = reasonInput.value.trim();
  
    if (!selectedMood || !selectedKeyword || !reason) {
      alert("Semua kolom wajib diisi!");
      return;
    }
  
    console.log("Selected Mood:", selectedMood); // Tambahkan log ini
  
    const payload = {
      user_id: user.id,
      date: today,
      mood: selectedMood,
      keyword: selectedKeyword,
      reason,
    };
  
    try {
      const response = await fetch("api/mood/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengirim mood.");
      }
  
      const result = await response.json();
      alert(result.message || "Mood berhasil dikirim!");
      setTimeout(() => {
        window.location.href = "finishMood.html";
      }, 2000);
    } catch (error) {
      console.error("Error submitting mood:", error);
      alert(error.message || "Gagal mengirim mood!");
    }
  });

  // Helper function to format date for display
  function formatDateForDisplay(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("id-ID", options).replace(/\//g, "-");
  }
});