document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Sesi tidak valid. Silakan login kembali.");
    window.location.href = "index.html";
    return;
  }

  // DOM Elements
  const weekRangeEl = document.getElementById("weekRange");
  const prevWeekBtn = document.getElementById("prevWeek");
  const nextWeekBtn = document.getElementById("nextWeek");
  const trendMoodEl = document.getElementById("trendMood");
  const moodChartCtx = document.getElementById("moodChart")?.getContext("2d");
  const weeklySummaryEl = document.getElementById("weekly-summary");
  const loadingIndicator = document.getElementById("loading-indicator");
  const todayMoodStatus = document.getElementById("today-mood-status");
  const todayDateEl = document.getElementById("today-date");
  const todayMoodActions = document.getElementById("today-mood-actions");
  const recentMoodsContainer = document.getElementById("recent-moods-container");
  

  let currentWeekStart = getMonday(new Date());
  let moodChart;

  // Initialize UI
  updateWeekRangeText();
  await fetchAndRenderMood(user.id);

  // Event Listeners for Week Navigation
  prevWeekBtn.addEventListener("click", async () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateWeekRangeText();
    await fetchAndRenderMood(user.id);
  });

  nextWeekBtn.addEventListener("click", async () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateWeekRangeText();
    await fetchAndRenderMood(user.id);
  });

  // Helper Functions
  function getMonday(d) {
    d = new Date(d);
    d.setHours(0, 0, 0, 0); // Ensure time is midnight
    const day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(d.setDate(diff));
  }

  function updateWeekRangeText() {
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);

    if (weekRangeEl) {
      weekRangeEl.textContent = `${formatDateForFrontend(currentWeekStart)} - ${formatDateForFrontend(end)}`;
    }
  }

  function formatDateForFrontend(date) {
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return date.toLocaleDateString("id-ID", options).replace(/\//g, "/");
  }

  function formatDateForBackend(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Fetch and Render Mood Data
  async function fetchAndRenderMood(userId) {
    const start = new Date(currentWeekStart);
    const end = new Date(currentWeekStart);
    end.setDate(start.getDate() + 6);

    try {
      // Show loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = "block";
      }

      const backendStartDate = formatDateForBackend(start);
      const backendEndDate = formatDateForBackend(end);

      console.log("Fetching data with:", {
        userId,
        backendStartDate,
        backendEndDate,
      });

      // Fetch weekly mood data
      const weeklyMoodResponse = await fetch(
        `api/mood/weekly?user_id=${userId}&start=${backendStartDate}&end=${backendEndDate}`
      );

      if (!weeklyMoodResponse.ok) {
        throw new Error("Gagal mengambil data mood mingguan.");
      }

      const weeklyMoodData = await weeklyMoodResponse.json();

      // Fetch weekly summary
      const weeklySummaryResponse = await fetch(
        `api/mood/weekly-summary?user_id=${userId}`
      );

      if (!weeklySummaryResponse.ok) {
        throw new Error("Gagal mengambil analisis mingguan.");
      }

      const weeklySummaryData = await weeklySummaryResponse.json();

      // Fetch today's mood status
      const today = new Date().toISOString().split("T")[0];
      const todayMoodResponse = await fetch(
        `api/mood/check?user_id=${userId}&date=${today}`
      );

      if (!todayMoodResponse.ok) {
        throw new Error("Gagal memeriksa mood hari ini.");
      }

      const todayMoodExists = await todayMoodResponse.json();

      // Render all components
      renderChart(generateMoodData(weeklyMoodData.data, start));
      updateTrendLabel(generateMoodData(weeklyMoodData.data, start));
      renderWeeklySummary(weeklySummaryData.summary);
      renderTodayMood(todayMoodExists.exists);
      renderRecentMoods(weeklyMoodData.data.filter((entry) => entry.date !== today).slice(-6));
    } catch (error) {
      console.error("Error fetching mood data:", error);
      alert(error.message || "Terjadi kesalahan saat memuat data.");

      // Render empty chart if there's an error
      renderChart(Array(7).fill(null));
    } finally {
      // Hide loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = "none";
      }
    }
  }

  function generateMoodData(dbData, startDate) {
    const moodMap = {
      sangat_buruk: 1,
      buruk: 2,
      netral: 3,
      baik: 4,
      sangat_baik: 5,
    };

    const result = Array(7).fill(null); // Initialize array for 7 days

    dbData.forEach((entry) => {
      const entryDate = new Date(entry.date); // Parse date from backend
      entryDate.setHours(0, 0, 0, 0); // Ensure time is midnight
      const index = Math.floor((entryDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate day index

      if (index >= 0 && index < 7) {
        const moodValue = moodMap[entry.mood.toLowerCase()] || null;
        result[index] = moodValue; // Map mood value to the correct index
      }
    });

    return result;
  }

  function renderChart(data) {
    if (moodChart) moodChart.destroy();

    const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
      (day, index) => `${day} ${new Date(currentWeekStart).getDate() + index}`
    );

    const moodLabels = {
      1: "Sangat Buruk",
      2: "Buruk",
      3: "Netral",
      4: "Baik",
      5: "Sangat Baik",
    };

    moodChart = new Chart(moodChartCtx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Mood Harian",
            data,
            borderColor: "#A5FF53",
            backgroundColor: "#A5FF53",
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 6,
            fill: false,
            spanGaps: true, // Connect points even if there are null values
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: (value) => moodLabels[value],
            },
            grid: {
              color: "#ccc",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const mood = moodLabels[context.parsed.y];
                return `Mood: ${mood}`;
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    });
  }

  function updateTrendLabel(data) {
    const moodCounts = {};
    data.forEach((mood) => {
      if (mood) {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      }
    });

    let mostFrequentMood = null;
    let maxCount = 0;

    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > maxCount) {
        mostFrequentMood = mood;
        maxCount = count;
      }
    }

    const moodLabels = {
      1: "Sangat Buruk",
      2: "Buruk",
      3: "Netral",
      4: "Baik",
      5: "Sangat Baik",
    };

    const trendLabel = mostFrequentMood ? moodLabels[mostFrequentMood] : "Belum Ada Data";

    if (trendMoodEl) {
      trendMoodEl.textContent = trendLabel;
    }
  }

  function renderWeeklySummary(summary) {
    if (weeklySummaryEl) {
      weeklySummaryEl.textContent = summary || "Analisis mingguan tidak tersedia.";
    }
  }

  function renderTodayMood(exists) {

  
    if (!todayMoodStatus || !todayDateEl || !todayMoodActions) {
      console.error("Element #today-mood-status or related elements not found.");
      return;
    }
  
    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  
    // Set tanggal hari ini
    todayDateEl.textContent = formattedDate;
  
    // Reset konten aksi mood
    todayMoodActions.innerHTML = "";
  
    if (exists) {
      // Jika sudah mengisi, tambahkan tombol "Sudah Mengisi"
      const filledButton = document.createElement("a");
      filledButton.className =
        "bg-primary-04 px-5 py-2 font-semibold rounded-lg text-md text-neutral-09 border border-neutral-09 transition flex items-center gap-2";
      filledButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-9.88a.75.75 0 00-1.08-1.04L9 11.44 7.54 10a.75.75 0 10-1.08 1.04l2 2a.75.75 0 001.08 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        Sudah Mengisi
      `;
  
      // Tambahkan event listener untuk tombol "Sudah Mengisi"
      filledButton.addEventListener("click", () => showMoodDetails(formatDateForBackend(today)));
  
      // Masukkan tombol ke dalam container
      todayMoodActions.appendChild(filledButton);
    } else {
      // Jika belum mengisi, tambahkan teks "Belum Mengisi" dan tombol "Isi Sekarang"
      const notFilledText = document.createElement("span");
      notFilledText.className =
        "flex items-center gap-1 bg-dangers-01 px-5 py-2 text-dangers-04 font-semibold rounded-lg border border-dangers-04";
      notFilledText.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.12-11.88a1 1 0 00-1.41 0L10 6.59 9.29 5.88a1 1 0 10-1.41 1.41L8.59 8l-.7.71a1 1 0 001.41 1.41L10 9.41l.71.7a1 1 0 001.41-1.41L11.41 8l.71-.71a1 1 0 000-1.41z"
            clip-rule="evenodd" />
        </svg>
        Belum Mengisi
      `;
      todayMoodActions.appendChild(notFilledText);
  
      const fillNowButton = document.createElement("a");
      fillNowButton.href = "formMood.html";
      fillNowButton.className =
        "bg-primary-04 px-5 py-2 font-semibold rounded-lg text-md text-neutral-09 hover:bg-primary-02 border border-neutral-09 transition ml-4";
      fillNowButton.textContent = "Isi Sekarang";
  
      todayMoodActions.appendChild(fillNowButton);
    }
  }

  function renderRecentMoods(data) {
  
    if (!recentMoodsContainer) {
      console.error("Element #recent-moods-container not found.");
      return;
    }
  
    recentMoodsContainer.innerHTML = "";
  
    data.forEach((entry) => {
      const box = document.createElement("div");
      box.className =
        "border border-neutral-09 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transform transition-transform duration-200 hover:scale-102 hover:shadow-sm";
  
      const formattedDate = new Date(entry.date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
  
      box.innerHTML = `
        <span class="text-lg">${formattedDate}</span>
        <button class="show-mood-details bg-primary-04 px-5 py-2 font-semibold rounded-lg text-md text-neutral-09 border border-neutral-09 transition flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-9.88a.75.75 0 00-1.08-1.04L9 11.44 7.54 10a.75.75 0 10-1.08 1.04l2 2a.75.75 0 001.08 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          Sudah Mengisi
        </button>
      `;
  
      // Add event listener to the button
      const button = box.querySelector(".show-mood-details");
      button.addEventListener("click", () => showMoodDetails(entry.date));
  
      recentMoodsContainer.appendChild(box);
    });
  }
  
  function showMoodDetails(date) {
    fetch(`api/mood/all?user_id=${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        const moodData = data.data.find((entry) => entry.date === date);
        if (!moodData) {
          alert("Data mood tidak ditemukan.");
          return;
        }
  
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
        modal.innerHTML = `
          <div class="bg-white rounded-lg p-6 w-[80%] max-w-2xl relative">
            <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onclick="this.parentElement.parentElement.remove()">×</button>
            <h2 class="font-bold text-xl mb-4">Detail Mood - ${new Date(date).toLocaleDateString("id-ID")}</h2>
            <p><strong>Mood:</strong> ${moodData.mood}</p>
            <p><strong>Kata Kunci:</strong> ${moodData.keyword || "-"}</p>
            <p><strong>Alasan:</strong> ${moodData.reason || "-"}</p>
          </div>
        `;
        document.body.appendChild(modal);
      })
      .catch((error) => {
        console.error("Error fetching mood details:", error);
        alert("Gagal mengambil detail mood.");
      });
  }
  
  // Logout Button (Desktop)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
  
  // Logout Button (Mobile)
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
  
  // Mobile Menu
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
  };
});
