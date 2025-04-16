// Navbar Scroll Background Color
window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("bg-neutral-02", "navbar-shadow");
        navbar.classList.remove("bg-transparent");
    } else {
        navbar.classList.add("bg-transparent");
        navbar.classList.remove("bg-neutral-02", "navbar-shadow");
    }
});

// Mobile Menu Toggle
const menuButton = document.getElementById("mobile-menu-button");
const closeButton = document.getElementById("close-mobile-menu");
const mobileMenu = document.getElementById("mobile-menu");
const responsiveMenu = document.getElementById("responsive-menu");

menuButton.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
    scrollToTopBtn.classList.add("hidden");
});


closeButton.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    scrollToTopBtn.classList.remove("hidden");
});

// Close menu and smooth scroll when nav link clicked
document.querySelectorAll("#mobile-menu a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            mobileMenu.classList.add("hidden");
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Active link smooth animation
window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("shadow-md");
    } else {
        navbar.classList.remove("shadow-md");
    }
});

// Swiper How to Use
const howToUseSwiper = new Swiper("#howToUseSwiper", {
    slidesPerView: 1.2,
    spaceBetween: 24,
    grabCursor: true,
    navigation: {
        nextEl: "#how-to-use .swiper-button-next",
        prevEl: "#how-to-use .swiper-button-prev",
    },
    breakpoints: {
        768: {
            slidesPerView: 1.5,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// Swiper Testimonial
const testimonialSwiper = new Swiper("#testimoni .swiper", {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 1,
    autoplay: {
        delay: 3000,
    },
    navigation: {
        nextEl: "#testimoni .swiper-button-next",
        prevEl: "#testimoni .swiper-button-prev",
    },
    pagination: {
        el: "#testimoni .swiper-pagination",
        clickable: true,
    },
});

// Function FAQ
function toggleFAQ(button) {
    const content = button.nextElementSibling;
    const svgIcon = button.querySelector("svg");
    const container = button.parentElement;

    const isOpen = !content.classList.contains("hidden");

    document.querySelectorAll("#faq .faq-container").forEach((item) => {
        item.classList.remove("bg-primary-02");
        item.querySelector("div").classList.add("hidden");
        item.querySelector("svg").classList.remove("rotate-180");
    });

    if (!isOpen) {
        content.classList.remove("hidden");
        container.classList.add("bg-primary-02");
        svgIcon.classList.add("rotate-180");
    }
}

// Scroll to Up Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const footer = document.getElementById("footer");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const footerOffsetTop = footer.offsetTop;

    if (scrollY > 300) {
        scrollToTopBtn.classList.remove("opacity-0", "pointer-events-none");
        scrollToTopBtn.classList.add("opacity-100", "pointer-events-auto");
    } else {
        scrollToTopBtn.classList.add("opacity-0", "pointer-events-none");
        scrollToTopBtn.classList.remove("opacity-100", "pointer-events-auto");
    }

    const buttonHeight = 64;
    const safeBottom = 24;
    const currentBottom = scrollY + windowHeight - footerOffsetTop;

    if (currentBottom > 0) {
        scrollToTopBtn.style.bottom = `${currentBottom + safeBottom}px`;
    } else {
        scrollToTopBtn.style.bottom = `${safeBottom}px`;
    }
});

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});
    
    // Animation Collage FAQ
    function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = button.nextElementSibling;
    const icon = button.querySelector('svg');

    const allAnswers = document.querySelectorAll('.faq-container > div:not(.faq-container > button)');
    const allIcons = document.querySelectorAll('.faq-container svg');

    // Tutup semua lainnya (optional)
    allAnswers.forEach((el) => {
      if (el !== answer) {
        el.style.maxHeight = null;
        el.classList.add("hidden");
      }
    });
    allIcons.forEach((svg) => {
      if (svg !== icon) {
        svg.classList.remove("rotate-180");
      }
    });

    const isOpen = !answer.classList.contains("hidden");

    if (isOpen) {
      answer.style.maxHeight = null;
      answer.classList.add("hidden");
      icon.classList.remove("rotate-180");
    } else {
      answer.classList.remove("hidden");
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.classList.add("rotate-180");
    }
  }

    // Animasi Fade in
    document.addEventListener('DOMContentLoaded', () => {
        const fadeElements = document.querySelectorAll('.fade-in-element');
    
        const checkFadeIn = () => {
          // Tentukan seberapa jauh elemen harus masuk ke viewport sebelum animasi dimulai
          // Nilai 0.8 berarti animasi dimulai saat 80% bagian atas viewport tercapai oleh elemen
          const triggerBottom = window.innerHeight * 0.85;
    
          fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
    
            // Jika bagian atas elemen kurang dari titik pemicu di viewport
            if (elementTop < triggerBottom) {
              element.classList.add('visible');
            } else {
              // Opsional: Hapus kelas 'visible' jika Anda ingin elemen fade out saat di-scroll ke atas lagi
              // element.classList.remove('visible');
            }
          });
        };
    
        // Jalankan pengecekan saat halaman pertama kali dimuat (untuk elemen yang sudah terlihat)
        checkFadeIn();
    
        // Jalankan pengecekan setiap kali pengguna melakukan scroll
        window.addEventListener('scroll', checkFadeIn);
      });
    
      // Script untuk toggle FAQ (Anda sudah punya ini, pastikan tidak terduplikasi)
      function toggleFAQ(button) {
        const container = button.closest('.faq-container');
        const content = container.querySelector('div');
        const icon = button.querySelector('svg');
    
        if (content.style.maxHeight && content.style.maxHeight !== "0px") {
          // Menutup FAQ
          content.style.maxHeight = "0px";
          content.classList.add('hidden'); // Tambahkan hidden lagi untuk kepastian
          icon.style.transform = 'rotate(0deg)';
          container.classList.remove('bg-primary-02'); // Hapus background saat tertutup
          button.classList.remove('bg-primary-02'); // Hapus background button jika ada
        } else {
          // Membuka FAQ
          content.classList.remove('hidden'); // Hapus hidden dulu
          // Set max-height ke scrollHeight agar transisi terlihat
          content.style.maxHeight = content.scrollHeight + "px";
          icon.style.transform = 'rotate(180deg)';
          container.classList.add('bg-primary-02'); // Tambahkan background saat terbuka
          button.classList.add('bg-primary-02'); // Tambahkan background button
        }
      }
    
      // Script untuk Navbar Scroll (Pastikan ini ada jika diperlukan)
      window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) { // Ubah 50 jika Anda ingin trigger di posisi scroll lain
          navbar.classList.add('bg-white', 'shadow-md');
        } else {
          navbar.classList.remove('shadow-md');
           // Anda mungkin ingin bg-white tetap ada atau menghapusnya tergantung desain awal
        }
      });
    
      // Script untuk Mobile Menu 
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
      });
    
      closeMobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    
      // Tutup menu jika link di klik (opsional tapi bagus)
      const mobileMenuLinks = mobileMenu.querySelectorAll('a');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
           mobileMenu.classList.add('hidden');
        });
      });

      var testimoniSwiper = new Swiper("#testimoni .swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true, // Jika ingin loop
        pagination: {
          el: "#testimoni .swiper-pagination",
          clickable: true,
        },
         autoplay: { // Jika ingin autoplay
           delay: 5000, // Ganti sesuai keinginan (dalam milidetik)
           disableOnInteraction: false,
         },
      });
    
      
      