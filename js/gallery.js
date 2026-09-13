/* ==========================================================================
   GALLERY & ALBUM SYSTEM (SANITY CMS INTEGRATION)
   Handles Album List page (gallery.html) & Single Album page (gallery-album.html)
   ========================================================================== */

// Fallback albums data (used if Sanity returns no published albums yet)
const FALLBACK_ALBUMS = [
  {
    _id: 'fallback-1',
    title: 'Interactive Phonics & Reading Sessions',
    slug: 'interactive-phonics-reading-sessions',
    category: 'classroom',
    coverImageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492897/course_phonics_helmof.png',
    photoCount: 4,
    photos: [
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492897/course_phonics_helmof.png', caption: 'Interactive Phonics Story Reading' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492896/course_spoken_english_v47rna.png', caption: 'Group Reading & Pronunciation Drills' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492893/course_hindi_oigvvw.png', caption: 'Sound Identification & Blending Practice' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492893/course_handwriting_qm780r.png', caption: 'Interactive Storyboard Session' },
    ]
  },
  {
    _id: 'fallback-2',
    title: 'Montessori Practical Sensorial Training',
    slug: 'montessori-practical-sensorial-training',
    category: 'montessori',
    coverImageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/montessori_certificate_etq5ug.png',
    photoCount: 3,
    photos: [
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/montessori_certificate_etq5ug.png', caption: 'Wooden Sensorial Apparatus Practice' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1789204149/ChatGPT_Image_Sep_12_2026_02_35_16_PM_wqvxur.png', caption: 'Teacher Trainee Practical Demonstration' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492890/course_tuition_ieeqzr.png', caption: 'Practical Life Exercise Training' },
    ]
  },
  {
    _id: 'fallback-3',
    title: 'Annual Student Art & Craft Showcase',
    slug: 'annual-student-art-craft-showcase',
    category: 'events',
    coverImageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_drawing_rtfncs.png',
    photoCount: 4,
    photos: [
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_drawing_rtfncs.png', caption: 'Student Art Exhibition & Craft Display' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492894/course_art_craft_iytijw.png', caption: 'Fine Art & Canvas Painting Workshop' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_drawing_rtfncs.png', caption: 'Color Theory & Sketching Session' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492894/course_art_craft_iytijw.png', caption: 'Craft Sculpture & Hands-on Projects' },
    ]
  },
  {
    _id: 'fallback-4',
    title: 'Abacus Speed Calculation Practice',
    slug: 'abacus-speed-calculation-practice',
    category: 'classroom',
    coverImageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_abacus_klpym7.png',
    photoCount: 3,
    photos: [
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_abacus_klpym7.png', caption: 'Mental Math Bead Calculation Drill' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492895/course_abacus_klpym7.png', caption: 'Timed Abacus Computation Test' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492890/course_tuition_ieeqzr.png', caption: 'Concentration & Focus Drills' },
    ]
  },
  {
    _id: 'fallback-5',
    title: 'Academy Chess Championship',
    slug: 'academy-chess-championship',
    category: 'events',
    coverImageUrl: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492891/course_chess_grbkw4.png',
    photoCount: 3,
    photos: [
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492891/course_chess_grbkw4.png', caption: 'Inter-Academy Chess Tournament Round' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492893/course_carrom_eyk3tt.png', caption: 'Tactical Middlegame Strategy Session' },
      { url: 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1788492891/course_chess_grbkw4.png', caption: 'Indoor Games Award Ceremony' },
    ]
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  const galleryContainer = document.getElementById('galleryContainer');
  const albumPhotoGrid = document.getElementById('albumPhotoGrid');

  if (galleryContainer) {
    await initGalleryPage(galleryContainer);
  }

  if (albumPhotoGrid) {
    await initAlbumDetailPage(albumPhotoGrid);
  }
});

// ==========================================================================
// 1. GALLERY PAGE: ALBUMS LIST
// ==========================================================================
async function initGalleryPage(container) {
  let albums = null;

  if (window.SanityCMS && typeof window.SanityCMS.fetchAllAlbums === 'function') {
    albums = await window.SanityCMS.fetchAllAlbums();
  }

  // Use fallback albums if Sanity has no records yet
  if (!albums || albums.length === 0) {
    albums = FALLBACK_ALBUMS;
  }

  renderAlbumCards(container, albums);
  setupCategoryFilterTabs(container, albums);
}

function renderAlbumCards(container, albums) {
  container.innerHTML = '';

  if (albums.length === 0) {
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; font-size: 16px; color: var(--color-text-mid);">No albums found in this category.</p>`;
    return;
  }

  albums.forEach(album => {
    const card = document.createElement('a');
    card.href = `gallery-album.html?slug=${encodeURIComponent(album.slug)}`;
    card.className = 'album-card nb-card reveal visible';
    card.setAttribute('data-category', (album.category || '').toLowerCase());

    const formattedCategory = capitalize(album.category || 'General');
    const photoCountText = album.photoCount ? `📁 ${album.photoCount} Photos` : '📁 Album';
    const coverUrl = album.coverImageUrl || 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1789204149/ChatGPT_Image_Sep_12_2026_02_35_16_PM_wqvxur.png';

    card.innerHTML = `
      <div class="nb-image" style="aspect-ratio: 4/3; height: 240px;">
        <span class="chip chip-gold" style="position: absolute; top: 12px; left: 12px; z-index: 2;">${formattedCategory}</span>
        <img src="${coverUrl}" alt="${album.title}" loading="lazy">
        <div class="album-badge-overlay">${photoCountText}</div>
      </div>
      <div class="album-card-body">
        <h3 class="text-h4" style="color: var(--color-text-dark); margin-bottom: 12px;">${album.title}</h3>
        <span class="btn-outline" style="align-self: flex-start; padding: 6px 14px; font-size: 13px;">View Album →</span>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.observeReveals) {
    window.observeReveals(container);
  }
}

function setupCategoryFilterTabs(container, allAlbums) {
  const filterTabs = document.querySelectorAll('.gallery-tab');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active', 'chip-gold'));
      filterTabs.forEach(t => t.classList.add('btn-outline'));

      tab.classList.remove('btn-outline');
      tab.classList.add('active', 'chip-gold');

      const filter = (tab.dataset.filter || 'all').toLowerCase();

      if (filter === 'all') {
        renderAlbumCards(container, allAlbums);
      } else {
        const filtered = allAlbums.filter(a => (a.category || '').toLowerCase() === filter);
        renderAlbumCards(container, filtered);
      }
    });
  });
}

// ==========================================================================
// 2. ALBUM DETAIL PAGE: SINGLE ALBUM PHOTOS & LIGHTBOX
// ==========================================================================
async function initAlbumDetailPage(gridContainer) {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  let album = null;

  if (slug && window.SanityCMS && typeof window.SanityCMS.fetchAlbumBySlug === 'function') {
    album = await window.SanityCMS.fetchAlbumBySlug(slug);
  }

  // Check fallback albums if not found in Sanity
  if (!album && slug) {
    album = FALLBACK_ALBUMS.find(a => a.slug === slug);
  }

  // Default fallback if no slug or unknown slug
  if (!album) {
    album = FALLBACK_ALBUMS[0];
  }

  // Update Page Title & Headings
  const titleHeading = document.getElementById('albumTitleHeading');
  const breadcrumbTitle = document.getElementById('albumBreadcrumbTitle');
  const categoryChip = document.getElementById('albumCategoryChip');

  if (titleHeading) titleHeading.textContent = album.title;
  if (breadcrumbTitle) breadcrumbTitle.textContent = album.title;
  if (categoryChip) categoryChip.textContent = capitalize(album.category || 'Gallery');

  // Render photos
  gridContainer.innerHTML = '';
  const photos = album.photos || [];

  if (photos.length === 0) {
    gridContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; font-size: 16px; color: var(--color-text-mid);">No photos available in this album yet.</p>`;
    return;
  }

  photos.forEach((photo, index) => {
    const photoUrl = typeof photo === 'string' ? photo : (photo.url || photo.src);
    const captionText = photo.caption || photo.alt || `${album.title} - Photo ${index + 1}`;
    const validPhotoUrl = photoUrl || album.coverImageUrl || 'https://res.cloudinary.com/dkht5j3tw/image/upload/f_auto,q_auto/v1789204149/ChatGPT_Image_Sep_12_2026_02_35_16_PM_wqvxur.png';

    const item = document.createElement('div');
    item.className = 'photo-card-item nb-image reveal visible';
    item.setAttribute('data-index', index);
    item.setAttribute('data-src', validPhotoUrl);
    item.setAttribute('data-caption', captionText);

    item.innerHTML = `
      <img src="${validPhotoUrl}" alt="${captionText}" loading="lazy">
    `;

    gridContainer.appendChild(item);
  });

  if (window.observeReveals) {
    window.observeReveals(gridContainer);
  }

  // Initialize Lightbox Modal for these photos
  initLightboxModal(photos, album.title);
}

// ==========================================================================
// 3. LIGHTBOX MODAL FUNCTIONALITY
// ==========================================================================
function initLightboxModal(photosList, defaultTitle) {
  const photoItems = document.querySelectorAll('.photo-card-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close-btn');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  if (!lightboxModal) return;

  let currentIndex = 0;

  photoItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox(currentIndex);
    });
  });

  function openLightbox(idx) {
    const photo = photosList[idx];
    if (!photo) return;

    const photoUrl = typeof photo === 'string' ? photo : (photo.url || photo.src);
    const captionText = photo.caption || photo.alt || `${defaultTitle} - Photo ${idx + 1}`;

    lightboxImg.src = photoUrl;
    lightboxCaption.textContent = captionText;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    if (!photosList.length) return;
    currentIndex = (currentIndex + dir + photosList.length) % photosList.length;
    openLightbox(currentIndex);
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext?.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

// Helper utility
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
