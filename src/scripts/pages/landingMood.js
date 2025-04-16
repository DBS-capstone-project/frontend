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

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const weekRangeEl = document.getElementById("weekRange");
  const prevWeekBtn = document.getElementById("prevWeek");
  const nextWeekBtn = document.getElementById("nextWeek");
  const trendMoodEl = document.getElementById("trendMood");
  const moodChartCtx = document.getElementById("moodChart").getContext("2d");
  const loadingIndicator = document.getElementById("loading-indicator");

  let currentWeekStart = getMonday(new Date());
  let moodChart;

  updateWeekRangeText();
  await fetchAndRenderMood(user.id);

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

  function getMonday(d) {
    d = new Date(d);
    d.setHours(0, 0, 0, 0); // Pastikan waktu adalah tengah malam
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

      const response = await fetch(
        `api/mood/weekly?user_id=${userId}&start=${backendStartDate}&end=${backendEndDate}`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data mood.");
      }

      const data = await response.json();

      // Debugging: Log data received from backend
      console.log("Data received from backend:", data);

      const moodData = generateMoodData(data.data, start);
      renderChart(moodData);
      updateTrendLabel(moodData);
    } catch (error) {
      console.error("Error fetching mood data:", error);
      alert(error.message || "Gagal mengambil data mood.");

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

    const result = Array(7).fill(null); // Inisialisasi array kosong untuk 7 hari

    console.log("Mapping mood data to chart:");
    dbData.forEach((entry) => {
      const entryDate = new Date(entry.date); // Parse tanggal dari backend
      entryDate.setHours(0, 0, 0, 0); // Pastikan waktu adalah tengah malam
      const index = Math.floor((entryDate - startDate) / (1000 * 60 * 60 * 24)); // Hitung indeks hari

      console.log(`Entry:`, entry);
      console.log(`Date: ${entryDate.toISOString()}, Index: ${index}`);

      if (index >= 0 && index < 7) {
        const moodValue = moodMap[entry.mood.toLowerCase()] || null;
        console.log(`Mapped mood value: ${moodValue}`);
        result[index] = moodValue; // Isi array dengan nilai mood
      } else {
        console.warn(`Date ${entryDate.toISOString()} is out of range for the current week.`);
      }
    });

    console.log("Final mapped mood data:", result);
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
            spanGaps: true, // Menghubungkan titik meskipun ada null
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

  // Add event listener for logout button (desktop)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }

  // Add event listener for logout button (mobile)
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }

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