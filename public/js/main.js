document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('gdbit-theme');

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('gdbit-theme', nextTheme);
  });

  if (window.AOS) {
    AOS.init({ duration: 800, once: true, offset: 80 });
  }

  const countElements = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const targetText = element.getAttribute('data-count') || element.textContent || '0';
      const digits = Number(String(targetText).replace(/[^0-9.]/g, '')) || 0;
      const suffix = String(targetText).replace(/[0-9.]/g, '').trim();
      let current = 0;
      const steps = 40;
      const increment = digits / steps;
      const timer = window.setInterval(() => {
        current += increment;
        if (current >= digits) {
          window.clearInterval(timer);
          element.textContent = `${targetText}`;
        } else {
          element.textContent = `${Math.round(current).toLocaleString()}${suffix}`;
        }
      }, 24);
      observer.unobserve(element);
    });
  }, { threshold: 0.35 });
  countElements.forEach((element) => countObserver.observe(element));

  const chartCanvas = document.getElementById('impactChart');
  if (chartCanvas && window.Chart) {
    const labels = JSON.parse(chartCanvas.dataset.chartLabels || '[]');
    const values = JSON.parse(chartCanvas.dataset.chartValues || '[]');
    new Chart(chartCanvas, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Impact score',
          data: values,
          borderColor: '#4fd08a',
          backgroundColor: 'rgba(79, 208, 138, 0.18)',
          pointBackgroundColor: '#d7b46a'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.12)' },
            grid: { color: 'rgba(255,255,255,0.12)' },
            pointLabels: { color: 'rgba(245,247,242,0.9)', font: { family: 'Space Grotesk' } },
            ticks: { backdropColor: 'transparent', color: 'rgba(245,247,242,0.72)' }
          }
        },
        plugins: {
          legend: { labels: { color: 'rgba(245,247,242,0.82)' } }
        }
      }
    });
  }

  const swiperEl = document.querySelector('.news-swiper');
  if (swiperEl && window.Swiper) {
    new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  if (window.gsap) {
    const heroAside = document.querySelector('.hero-aside');
    if (heroAside) {
      gsap.from(heroAside, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    }
  }

  // Sidebar toggle for small screens
  const sideToggle = document.getElementById('sideToggle');
  const sideNav = document.getElementById('sideNav');
  const syncSideToggleState = () => {
    if (!sideToggle || !sideNav) return;
    sideToggle.setAttribute('aria-expanded', sideNav.classList.contains('open') ? 'true' : 'false');
  };

  if (sideNav && window.innerWidth >= 992) {
    sideNav.classList.add('open');
  }
  syncSideToggleState();

  sideToggle?.addEventListener('click', () => {
    sideNav?.classList.toggle('open');
    syncSideToggleState();
  });

  // Close sideNav when clicking outside or when a nav link is clicked
  document.addEventListener('click', (e) => {
    try {
      const target = e.target;
      if (!sideNav || !sideNav.classList.contains('open')) return;
      if (target.closest && (target.closest('#sideNav') || target.closest('#sideToggle'))) return;
      // clicked outside
      sideNav.classList.remove('open');
      syncSideToggleState();
    } catch (err) {
      // ignore
    }
  });

  // Close when any side-nav link is clicked (mobile)
  document.querySelectorAll('.side-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      sideNav?.classList.remove('open');
      syncSideToggleState();
    });
  });

  // Team modal handler
  const personModalEl = document.getElementById('personModal');
  if (personModalEl) {
    const modal = new bootstrap.Modal(personModalEl);
    document.querySelectorAll('.team-photo').forEach(img => {
      img.addEventListener('click', (e) => {
        const name = img.dataset.name || img.alt || '';
        const bio = img.dataset.bio || '';
        const src = img.getAttribute('src');
        const modalPhoto = document.getElementById('modalPhoto');
        const modalName = document.getElementById('modalName');
        const modalBio = document.getElementById('modalBio');
        if (modalPhoto) modalPhoto.src = src;
        if (modalName) modalName.textContent = name;
        if (modalBio) modalBio.textContent = bio;
        // Set status for Unlock Group
        const modalStatus = document.getElementById('modalStatus');
        let status = '';
        const parentBlock = img.closest('.company-block');
        if (parentBlock && parentBlock.querySelector('h3') && parentBlock.querySelector('h3').textContent.toLowerCase().includes('unlock')) {
          const lowerName = (name || '').toLowerCase();
          if (lowerName.includes('baraka')) status = 'Director';
          else if (lowerName.includes('frank')) status = 'Co-Founder';
          else if (lowerName.includes('mohamed')) status = 'Co-Founder';
        }
        if (modalStatus) {
          modalStatus.textContent = status;
          modalStatus.style.display = status ? '' : 'none';
        }
        modal.show();
      });
    });
  }
});
