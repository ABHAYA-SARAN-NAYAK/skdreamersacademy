/* ==========================================================================
   COUNTER JS - STATS BAR EASE-OUT COUNT-UP ANIMATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('[data-target]');
  if (!statNumbers.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    let startTimestamp = null;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic function
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(ease * target);
      
      el.textContent = currentVal + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
});
