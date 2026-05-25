/**
 * E-Portfolio PPG - Bima Kusuma Ardhana
 * ======================================
 * EDIT PANDUAN: Lihat file PANDUAN-EDIT.md di folder utama
 */

(function () {
  'use strict';

  /* ========== KONFIGURASI - MUDAH DIEDIT ========== */
  const CONFIG = {
    // Teks typing effect di hero
    typingText: 'Menjadi Guru Profesional untuk Mewujudkan Pendidikan yang Bermakna',
    typingSpeed: 60,
    typingPause: 2000,

    // Judul lagu di pemutar musik
    musicTitle: 'Lagu Favorit Saya',

    // Auto-play musik saat halaman dimuat (true/false)
    musicAutoplay: false,

    // Durasi loading screen (ms)
    loadingDuration: 2200,

    // Data grafik praktik mengajar (3 siklus) - EDIT nilai di sini
    chartPraktik: {
      labels: ['Siklus 1', 'Siklus 2', 'Siklus 3'],
      data: [82, 87, 91]
    },

    // Data diagram kompetensi - EDIT nilai di sini
    chartKompetensi: {
      labels: ['Pedagogik', 'Profesional', 'Sosial', 'Kepribadian'],
      data: [85, 80, 88, 82]
    }
  };

  /* ========== LOADING SCREEN ========== */
  const loadingScreen = document.getElementById('loading-screen');
  const loaderProgress = document.querySelector('.loader-progress');

  window.addEventListener('load', () => {
    if (loaderProgress) loaderProgress.style.width = '100%';
    setTimeout(() => {
      loadingScreen?.classList.add('hidden');
      document.body.style.overflow = '';
    }, CONFIG.loadingDuration);
  });

  document.body.style.overflow = 'hidden';

  /* ========== SCROLL PROGRESS BAR ========== */
  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  });

  /* ========== NAVBAR ========== */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      navToggle?.classList.remove('active');
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  /* ========== DARK / LIGHT MODE ========== */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('epp-theme') || 'light';

  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('epp-theme', next);
    updateThemeIcon(next);
    refreshCharts();
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  /* ========== TYPING EFFECT ========== */
  const typingEl = document.getElementById('typing-text');
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    if (!typingEl) return;
    const text = CONFIG.typingText;

    if (!isDeleting) {
      typingEl.textContent = text.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === text.length) {
        setTimeout(() => { isDeleting = true; typeEffect(); }, CONFIG.typingPause);
        return;
      }
    } else {
      typingEl.textContent = text.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        setTimeout(typeEffect, 500);
        return;
      }
    }
    setTimeout(typeEffect, isDeleting ? 30 : CONFIG.typingSpeed);
  }

  setTimeout(typeEffect, CONFIG.loadingDuration + 300);

  /* ========== MUSIC PLAYER ========== */
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');
  const bgMusic = document.getElementById('bg-music');
  const musicVolume = document.getElementById('music-volume');
  const musicTitleEl = document.getElementById('music-title');

  if (musicTitleEl) musicTitleEl.textContent = CONFIG.musicTitle;

  // EDIT: Untuk ganti lagu, ubah src di index.html pada tag <audio>
  if (bgMusic) {
    const customSrc = bgMusic.getAttribute('data-audio-src');
    if (customSrc) {
      bgMusic.src = customSrc;
      const source = bgMusic.querySelector('source');
      if (source) source.src = customSrc;
    }
    bgMusic.volume = (musicVolume?.value || 40) / 100;
  }

  musicVolume?.addEventListener('input', (e) => {
    if (bgMusic) bgMusic.volume = e.target.value / 100;
  });

  musicToggle?.addEventListener('click', () => {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {
        alert('Klik play untuk memutar musik. Pastikan link audio valid (MP3/direct URL).');
      });
      musicIcon.className = 'fas fa-pause';
      musicToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      musicIcon.className = 'fas fa-play';
      musicToggle.classList.remove('playing');
    }
  });

  if (CONFIG.musicAutoplay && bgMusic) {
    setTimeout(() => {
      bgMusic.play().then(() => {
        musicIcon.className = 'fas fa-pause';
        musicToggle?.classList.add('playing');
      }).catch(() => {});
    }, CONFIG.loadingDuration + 500);
  }

  /* ========== SCROLL REVEAL ========== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ========== PROGRESS BARS (Analisis) ========== */
  const progressFills = document.querySelectorAll('.progress-fill');

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width') || '0';
        entry.target.style.width = width + '%';
      }
    });
  }, { threshold: 0.5 });

  progressFills.forEach(bar => progressObserver.observe(bar));

  /* ========== ACCORDION ========== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      accordionItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ========== TABS (Penilaian) ========== */
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) content.classList.add('active');
      });
      refreshCharts();
    });
  });

  /* ========== CHARTS ========== */
  let chartPraktik = null;
  let chartKompetensi = null;

  function getChartColors() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    return {
      text: isDark ? '#cbd5e1' : '#334155',
      grid: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(30,58,95,0.08)'
    };
  }

  function initCharts() {
    const colors = getChartColors();

    const ctxPraktik = document.getElementById('chart-praktik');
    if (ctxPraktik) {
      chartPraktik = new Chart(ctxPraktik, {
        type: 'line',
        data: {
          labels: CONFIG.chartPraktik.labels,
          datasets: [{
            label: 'Nilai Praktik Mengajar',
            data: CONFIG.chartPraktik.data,
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#1e3a5f',
            pointBorderColor: '#d4af37',
            pointRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { labels: { color: colors.text } } },
          scales: {
            y: {
              beginAtZero: false,
              min: 70,
              max: 100,
              ticks: { color: colors.text },
              grid: { color: colors.grid }
            },
            x: { ticks: { color: colors.text }, grid: { color: colors.grid } }
          }
        }
      });
    }

    const ctxKompetensi = document.getElementById('chart-kompetensi');
    if (ctxKompetensi) {
      chartKompetensi = new Chart(ctxKompetensi, {
        type: 'radar',
        data: {
          labels: CONFIG.chartKompetensi.labels,
          datasets: [{
            label: 'Kompetensi',
            data: CONFIG.chartKompetensi.data,
            backgroundColor: 'rgba(30, 58, 95, 0.3)',
            borderColor: '#d4af37',
            pointBackgroundColor: '#d4af37'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: colors.text } } },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { color: colors.text, backdropColor: 'transparent' },
              grid: { color: colors.grid },
              pointLabels: { color: colors.text }
            }
          }
        }
      });
    }
  }

  function refreshCharts() {
    const colors = getChartColors();
    [chartPraktik, chartKompetensi].forEach(chart => {
      if (!chart) return;
      if (chart.options.plugins?.legend?.labels) {
        chart.options.plugins.legend.labels.color = colors.text;
      }
      chart.update();
    });
  }

  if (typeof Chart !== 'undefined') {
    initCharts();
  }

  /* ========== QUOTES SLIDER ========== */
  const quoteSlides = document.querySelectorAll('.quote-slide');
  const quoteDots = document.querySelectorAll('.quote-dots .dot');
  let quoteIndex = 0;

  function showQuote(index) {
    quoteSlides.forEach((s, i) => s.classList.toggle('active', i === index));
    quoteDots.forEach((d, i) => d.classList.toggle('active', i === index));
    quoteIndex = index;
  }

  quoteDots.forEach((dot, i) => {
    dot.addEventListener('click', () => showQuote(i));
  });

  setInterval(() => {
    if (quoteSlides.length) showQuote((quoteIndex + 1) % quoteSlides.length);
  }, 5000);

  /* ========== KONTAK FORM ========== */
  const kontakForm = document.getElementById('kontak-form');

  kontakForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('nama')?.value;
    const email = document.getElementById('email-form')?.value;
    const pesan = document.getElementById('pesan')?.value;

    // EDIT: Ganti dengan email Anda untuk mailto otomatis
    const mailto = `mailto:bimakusuma.ardhana@email.com?subject=Pesan dari ${encodeURIComponent(nama)}&body=${encodeURIComponent(pesan + '\n\nDari: ' + email)}`;
    window.location.href = mailto;

    kontakForm.reset();
    alert('Terima kasih! Aplikasi email akan terbuka untuk mengirim pesan Anda.');
  });

  /* ========== KOMPETENSI BAR ANIMATION ========== */
  const kompetensiCards = document.querySelectorAll('.kompetensi-card[data-animate]');

  const kompObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.kompetensi-bar div');
        if (bar) {
          const w = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = w; }, 100);
        }
      }
    });
  }, { threshold: 0.3 });

  kompetensiCards.forEach(card => kompObserver.observe(card));

})();
