document.addEventListener("DOMContentLoaded", async () => {
  // Ambil data pengguna dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Sesi tidak valid. Silakan login kembali.");
    window.location.href = "index.html";
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

  try {
    // Cek apakah pengguna sudah mengisi refleksi hari ini
    const response = await fetch(`api/reflection/check?user_id=${user.id}&date=${today}`);
    if (!response.ok) {
      throw new Error("Gagal memeriksa data refleksi.");
    }

    const data = await response.json();
    if (data.exists) {
      alert("Kamu sudah mengisi refleksi hari ini. Coba lagi besok!");
      window.location.href = "chatAI.html"; // Arahkan ke chatAI jika sudah mengisi
      return;
    }
  } catch (error) {
    console.error("Error checking reflection:", error);
    alert("Terjadi kesalahan saat memeriksa refleksi harian.");
    return;
  }

  // Halaman ini hanya untuk kids.html, teens.html, atau adults.html
  console.log("Halaman refleksi aman untuk diakses.");

  // Inisialisasi form dan tombol submit
  initializeReflectionForm(user);
});

function initializeReflectionForm(user) {
  const form = document.getElementById("reflection-form");
  const submitButton = document.getElementById("submit-reflection");

  if (!submitButton) {
    console.error("Tombol submit tidak ditemukan!");
    return;
  }

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Mencegah perilaku default form submission

    // Mengambil semua input radio yang dipilih
    const formData = {};
    const inputs = document.querySelectorAll("input[type=radio]:checked");
    inputs.forEach((input) => {
      formData[input.name] = input.value;
    });

    // Validasi bahwa semua pertanyaan telah dijawab
    const totalQuestions = document.querySelectorAll(".question").length;
    if (Object.keys(formData).length !== totalQuestions) {
      alert("Silakan jawab semua pertanyaan!");
      return;
    }

    // Menambahkan user ID dan kategori ke payload
    const payload = {
      user_id: user.id,
      category: form.getAttribute("data-category"),
      ...formData,
    };

    try {
      // Ubah tombol submit menjadi "Loading..."
      submitButton.disabled = true;
      submitButton.textContent = "Loading...";

      // Kirim data ke backend menggunakan fetch
      const response = await fetch("api/reflection/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal menyimpan refleksi.");
      }

      // Tampilkan notifikasi sukses
      alert("Refleksi berhasil disimpan!");

      // Redirect ke halaman finishReflection.html setelah 2 detik
      setTimeout(() => {
        window.location.href = "finishReflection.html";
      }, 1000);
    } catch (error) {
      console.error("Error submitting reflection:", error);
      alert("Terjadi kesalahan saat menyimpan refleksi.");
    } finally {
      // Kembalikan tombol submit ke semula
      submitButton.disabled = false;
      submitButton.textContent = "Kirim & Selesai";
    }
  });
}