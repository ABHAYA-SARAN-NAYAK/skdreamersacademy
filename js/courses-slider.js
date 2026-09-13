/* ==========================================================================
   COURSES SLIDER JS - HORIZONTAL SCRAPBOOK SMOOTH SCROLLING & PROGRESS BAR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.courses-slider');
  const prevBtn = document.querySelector('.slide-prev');
  const nextBtn = document.querySelector('.slide-next');
  const progressFill = document.querySelector('.slider-progress-fill');

  if (!slider) return;

  const cardWidth = 324; // Card 300px + 24px gap

  prevBtn?.addEventListener('click', () => {
    slider.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
  });

  nextBtn?.addEventListener('click', () => {
    slider.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
  });

  // Progress Bar Scroll & Resize Sync
  function updateProgress() {
    if (!slider || !progressFill) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const percent = maxScroll > 0 ? (slider.scrollLeft / maxScroll) * 100 : 0;
    progressFill.style.width = percent + '%';
  }

  slider.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress();
});
