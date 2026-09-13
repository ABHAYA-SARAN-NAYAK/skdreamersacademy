/* ==========================================================================
   NAVBAR JS - MOBILE DRAWER & SCROLL SHADOW BEHAVIOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  // 1. Scroll Shadow Deepen
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Open / Close Toggle
  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    hamburger?.classList.toggle('open', isOpen);
    drawer?.classList.toggle('open', isOpen);
    overlay?.classList.toggle('open', isOpen);
    document.body.classList.toggle('drawer-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', () => toggleDrawer());
  overlay?.addEventListener('click', () => toggleDrawer(false));

  // Close drawer when clicking links
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // 3. Highlight Active Page Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
