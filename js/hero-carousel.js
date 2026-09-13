/* ==========================================================================
   HERO CAROUSEL SYSTEM (SANITY CMS INTEGRATION) & TESTIMONIAL TOGGLE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // === 1. HERO CAROUSEL SYSTEM ===
  const carouselTrack = document.getElementById('heroCarouselTrack');
  const dotsContainer = document.getElementById('heroCarouselDots');
  const prevBtn = document.querySelector('.hero-carousel-prev');
  const nextBtn = document.querySelector('.hero-carousel-next');
  const carouselFrame = document.querySelector('.hero-carousel-frame');

  if (carouselTrack) {
    // Attempt to fetch slides from Sanity CMS
    let sanitySlides = null;
    if (window.SanityCMS && typeof window.SanityCMS.fetchHeroSlides === 'function') {
      sanitySlides = await window.SanityCMS.fetchHeroSlides();
    }

    const FALLBACK_HERO_SLIDES = [
      { imageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492897/course_phonics_helmof.png', altText: 'Interactive Phonics & Early Reading at SK Dreamers Academy Thiruvottiyur' },
      { imageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_abacus_klpym7.png', altText: 'Abacus Mental Math & Brain Development Class in Chennai' },
      { imageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_drawing_rtfncs.png', altText: 'Foundation to Advanced Fine Art & Drawing Class' },
      { imageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492891/course_chess_grbkw4.png', altText: 'Chess Strategy & Tactical Coaching Session' },
      { imageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492894/course_art_craft_iytijw.png', altText: 'Creative Art & Hands-on Craft Workshop for Children' }
    ];

    const slidesToRender = (sanitySlides && sanitySlides.length > 0) ? sanitySlides : FALLBACK_HERO_SLIDES;

    carouselTrack.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    slidesToRender.forEach((slide, index) => {
      // Create slide
      const slideEl = document.createElement('div');
      slideEl.className = `hero-carousel-slide ${index === 0 ? 'active' : ''}`;
      slideEl.innerHTML = `
        <img src="${slide.imageUrl}" alt="${slide.altText || 'SK Dreamers Hero Slide'}">
        ${slide.altText ? `<div class="hero-carousel-caption">${slide.altText}</div>` : ''}
      `;
      carouselTrack.appendChild(slideEl);

      // Create dot
      if (dotsContainer) {
        const dotEl = document.createElement('button');
        dotEl.className = `hero-carousel-dot ${index === 0 ? 'active' : ''}`;
        dotEl.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) dotEl.setAttribute('aria-current', 'true');
        dotsContainer.appendChild(dotEl);
      }
    });

    // Re-query slides and dots elements
    const slides = carouselTrack.querySelectorAll('.hero-carousel-slide');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-carousel-dot') : [];

    if (slides.length > 0) {
      let currentIndex = 0;
      let autoSlideTimer = null;
      const intervalTime = 5000; // Auto-advance every 5 seconds (5000ms)

      function goToSlide(index) {
        if (index < 0) {
          index = slides.length - 1;
        } else if (index >= slides.length) {
          index = 0;
        }
        currentIndex = index;

        // Move track transform
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active class on slides
        slides.forEach((slide, i) => {
          if (i === currentIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });

        // Update active state on pagination dots
        dots.forEach((dot, i) => {
          if (i === currentIndex) {
            dot.classList.add('active');
            dot.setAttribute('aria-current', 'true');
          } else {
            dot.classList.remove('active');
            dot.removeAttribute('aria-current');
          }
        });
      }

      function nextSlide() {
        goToSlide(currentIndex + 1);
      }

      function prevSlide() {
        goToSlide(currentIndex - 1);
      }

      function startAutoSlide() {
        stopAutoSlide();
        autoSlideTimer = setInterval(nextSlide, intervalTime);
      }

      function stopAutoSlide() {
        if (autoSlideTimer) {
          clearInterval(autoSlideTimer);
          autoSlideTimer = null;
        }
      }

      // Event listeners for prev/next buttons
      nextBtn?.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });

      prevBtn?.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });

      // Pagination dot click listeners
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goToSlide(i);
          startAutoSlide();
        });
      });

      // Pause on hover
      if (carouselFrame) {
        carouselFrame.addEventListener('mouseenter', stopAutoSlide);
        carouselFrame.addEventListener('mouseleave', startAutoSlide);

        // Pause on touch & swipe handling
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;

        carouselFrame.addEventListener('touchstart', (e) => {
          stopAutoSlide();
          startX = e.touches[0].clientX;
          isSwiping = true;
        }, { passive: true });

        carouselFrame.addEventListener('touchmove', (e) => {
          if (!isSwiping) return;
          currentX = e.touches[0].clientX;
        }, { passive: true });

        carouselFrame.addEventListener('touchend', () => {
          if (!isSwiping) return;
          const diffX = startX - currentX;
          if (Math.abs(diffX) > 40 && currentX !== 0) {
            if (diffX > 0) {
              nextSlide();
            } else {
              prevSlide();
            }
          }
          isSwiping = false;
          startX = 0;
          currentX = 0;
          startAutoSlide();
        });
      }

      // Initialize
      goToSlide(0);
      startAutoSlide();
    }
  }

  // === 2. TESTIMONIAL EXPAND / COLLAPSE SYSTEM ===
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  testimonialCards.forEach(card => {
    const textEl = card.querySelector('.testimonial-text');
    const contentEl = card.querySelector('.testimonial-content');
    const toggleBtn = card.querySelector('.testimonial-read-more');

    if (!toggleBtn || !contentEl || !textEl) return;

    const isOverflowing = textEl.scrollHeight > 140;

    if (!isOverflowing) {
      toggleBtn.style.display = 'none';
      contentEl.style.maxHeight = 'none';
    } else {
      toggleBtn.style.display = 'inline-block';
    }

    toggleBtn.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      if (isExpanded) {
        card.classList.remove('expanded');
        toggleBtn.innerHTML = 'Read more ▾';
      } else {
        card.classList.add('expanded');
        toggleBtn.innerHTML = 'Show less ▴';
      }
    });
  });
});
