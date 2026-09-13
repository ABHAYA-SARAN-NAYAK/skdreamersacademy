/* ==========================================================================
   SANITY CMS CLIENT & GROQ QUERIES (VANILLA JS FETCH)
   Project ID: 1db60zrz | Dataset: production
   ========================================================================== */

const SANITY_CONFIG = {
  projectId: '1db60zrz',
  dataset: 'production',
  apiVersion: 'v2023-01-01',
};

/**
 * Executes a GROQ query against the Sanity Content API using plain fetch()
 * @param {string} query GROQ query string
 * @returns {Promise<any>} Response result array/object
 */
async function fetchFromSanity(query) {
  const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Sanity API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.warn('Sanity fetch warning:', error.message);
    return null;
  }
}

// --------------------------------------------------------------------------
// GROQ QUERIES & FETCH FUNCTIONS
// --------------------------------------------------------------------------

// (a) Fetch Ordered Hero Slides
const HERO_SLIDES_QUERY = `*[_type == "heroSlide"] | order(order asc){
  _id,
  "imageUrl": image.asset->url,
  altText,
  order
}`;

async function fetchHeroSlides() {
  const slides = await fetchFromSanity(HERO_SLIDES_QUERY);
  return (slides && slides.length > 0) ? slides : null;
}

// (b) Fetch All Gallery Albums (Cover + Category)
const ALL_ALBUMS_QUERY = `*[_type == "galleryAlbum"] | order(_createdAt desc){
  _id,
  title,
  "slug": slug.current,
  category,
  "coverImageUrl": coverImage.asset->url,
  "photoCount": count(photos)
}`;

async function fetchAllAlbums() {
  const albums = await fetchFromSanity(ALL_ALBUMS_QUERY);
  return (albums && albums.length > 0) ? albums : null;
}

// (c) Fetch Single Album with Photos Array by Slug
function getSingleAlbumQuery(slug) {
  return `*[_type == "galleryAlbum" && slug.current == "${slug}"][0]{
    _id,
    title,
    "slug": slug.current,
    category,
    "coverImageUrl": coverImage.asset->url,
    "photos": photos[]{
      _key,
      "url": asset->url,
      caption
    }
  }`;
}

async function fetchAlbumBySlug(slug) {
  if (!slug) return null;
  const query = getSingleAlbumQuery(slug);
  const album = await fetchFromSanity(query);
  return album || null;
}

// Make functions available globally
window.SanityCMS = {
  SANITY_CONFIG,
  fetchFromSanity,
  fetchHeroSlides,
  fetchAllAlbums,
  fetchAlbumBySlug,
  HERO_SLIDES_QUERY,
  ALL_ALBUMS_QUERY,
  getSingleAlbumQuery,
};
