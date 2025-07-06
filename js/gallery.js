// Dynamically load all images in /assets/gallery
const galleryImageFiles = [
  'how_it_started.jpeg',
  'martin_89.jpg',
  'martin_and_sons.jpg',
  'martin_arrival.jpeg',
  'martin_black_bg.jpg',
  'martin_congress.jpeg',
  'martin_formal.png',
  'martin_gram_suite_turtle_neck.jpeg',
  'martin_gram_suit.jpeg',
  'martin_on_the_mic.jpeg',
  'martin_on_the_mic.jpg'
];

const galleryImages = galleryImageFiles.map(filename => {
  const base = filename.replace(/\.[^.]+$/, '');
  return {
    src: `../assets/gallery/${filename}`,
    alt: base,
    caption: filename,
    category: 'all'
  };
});

galleryImages.sort((a, b) => a.caption.localeCompare(b.caption));

const galleryGrid = document.getElementById('galleryGrid');

function renderGallery() {
  galleryGrid.innerHTML = '';
  galleryImages.forEach((img) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" loading="lazy">
      <div class="gallery-caption">${img.caption}</div>
    `;
    galleryGrid.appendChild(card);
  });
  // Wait for all images to load, then apply Masonry
  const images = galleryGrid.querySelectorAll('img');
  let loaded = 0;
  images.forEach(img => {
    if (img.complete) {
      loaded++;
      if (loaded === images.length) applyMasonry();
    } else {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === images.length) applyMasonry();
      });
    }
  });
}

function applyMasonry() {
  const rowHeight = parseInt(window.getComputedStyle(galleryGrid).getPropertyValue('grid-auto-rows'));
  const rowGap = parseInt(window.getComputedStyle(galleryGrid).getPropertyValue('gap'));
  galleryGrid.querySelectorAll('.gallery-card').forEach(card => {
    const img = card.querySelector('img');
    const cardHeight = img.offsetHeight + (card.querySelector('.gallery-caption')?.offsetHeight || 0);
    const rowSpan = Math.ceil((cardHeight + rowGap) / (rowHeight + rowGap));
    card.style.gridRowEnd = `span ${rowSpan}`;
  });
}

// Initial render
renderGallery();
// Re-apply Masonry on window resize
window.addEventListener('resize', () => setTimeout(applyMasonry, 200)); 