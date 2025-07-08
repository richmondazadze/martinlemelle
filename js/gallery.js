// Gallery JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Gallery data with updated categories
  const galleryData = [
    // Lifestyle images
    { src: '../assets/gallery/martin_camel_photo.jpg', alt: 'Dr. Martin Lemelle camel photo', category: 'lifestyle' },
    { src: '../assets/gallery/martin_tower.jpg', alt: 'Dr. Martin Lemelle at tower', category: 'lifestyle' },
    { src: '../assets/gallery/martin_telephone.jpg', alt: 'Dr. Martin Lemelle on telephone', category: 'lifestyle' },
    { src: '../assets/gallery/martin_recording_studio.jpg', alt: 'Dr. Martin Lemelle in recording studio', category: 'lifestyle' },
    { src: '../assets/gallery/martin_lake.jpg', alt: 'Dr. Martin Lemelle at lake', category: 'lifestyle' },
    { src: '../assets/gallery/martin_89.jpg', alt: 'Dr. Martin Lemelle 1989', category: 'lifestyle' },
    
    // Events images (specific list provided by user)
    { src: '../assets/gallery/martin_and_tiger.jpeg', alt: 'Dr. Martin Lemelle with Grambling State University tiger mascot', category: 'events' },
    { src: '../assets/gallery/martin_arrival.jpeg', alt: 'Dr. Martin Lemelle arrival', category: 'events' },
    { src: '../assets/gallery/martin_black_student_photo.jpg', alt: 'Dr. Martin Lemelle with black student', category: 'events' },
    { src: '../assets/gallery/martin_book_launch.jpg', alt: 'Dr. Martin Lemelle book launch', category: 'events' },
    { src: '../assets/gallery/martin_congress.jpeg', alt: 'Dr. Martin Lemelle at Congress', category: 'events' },
    { src: '../assets/gallery/martin_gsu_sweats.jpg', alt: 'Dr. Martin Lemelle in GSU sweats', category: 'events' },
    { src: '../assets/gallery/martin_honoree.jpg', alt: 'Dr. Martin Lemelle as honoree', category: 'events' },
    { src: '../assets/gallery/martin_on_stage.jpg', alt: 'Dr. Martin Lemelle on stage', category: 'events' },
    { src: '../assets/gallery/martin_speech.jpg', alt: 'Dr. Martin Lemelle giving speech', category: 'events' },
    
    // All other images (not in Events or Lifestyle) - available for All Photos only
    { src: '../assets/gallery/martin_gram_suite_turtle_neck.jpeg', alt: 'Dr. Martin Lemelle in Grambling suite', category: 'other' },
    { src: '../assets/gallery/martin_and_sons.jpg', alt: 'Dr. Martin Lemelle and sons', category: 'other' },
    { src: '../assets/gallery/martin_black_bg.jpg', alt: 'Dr. Martin Lemelle professional portrait', category: 'other' },
    { src: '../assets/gallery/martin_formal.png', alt: 'Dr. Martin Lemelle formal portrait', category: 'other' },
    { src: '../assets/gallery/martin_in_studio.jpg', alt: 'Dr. Martin Lemelle in studio', category: 'other' },
    { src: '../assets/gallery/how_it_started.jpeg', alt: 'How it started - Dr. Martin Lemelle', category: 'other' },
    { src: '../assets/gallery/martin_gram_suit.jpeg', alt: 'Dr. Martin Lemelle in Grambling suit', category: 'other' },
    { src: '../assets/gallery/martin_on_the_mic.jpeg', alt: 'Dr. Martin Lemelle speaking', category: 'other' },
    { src: '../assets/gallery/martin_with_men.jpg', alt: 'Dr. Martin Lemelle with colleagues', category: 'other' },
    { src: '../assets/gallery/martin_with_cau.jpg', alt: 'Dr. Martin Lemelle at CAU', category: 'other' },
    { src: '../assets/gallery/martin_tiger_suit.jpg', alt: 'Dr. Martin Lemelle in tiger suit', category: 'other' },
    { src: '../assets/gallery/martin_students_in_studio.jpg', alt: 'Dr. Martin Lemelle with students in studio', category: 'other' },
    { src: '../assets/gallery/martin_orange_bg.jpg', alt: 'Dr. Martin Lemelle with orange background', category: 'other' },
    { src: '../assets/gallery/martin_conference_table.jpg', alt: 'Dr. Martin Lemelle at conference table', category: 'other' },
    { src: '../assets/gallery/martin_black_sweat.jpg', alt: 'Dr. Martin Lemelle in black sweats', category: 'other' }
  ];

  // Render all images once
  const galleryGrid = document.getElementById('gallery-grid');
  galleryGrid.innerHTML = '';
  const isMobile = () => window.innerWidth <= 480;
  // Helper to assign aspect class
  function assignAspectClass(img) {
    img.classList.remove('normal', 'wide', 'tall');
    if (img.naturalWidth && img.naturalHeight) {
      if (img.naturalWidth > img.naturalHeight * 1.2) {
        img.classList.add('wide');
      } else if (img.naturalHeight > img.naturalWidth * 1.2) {
        img.classList.add('tall');
      } else {
        img.classList.add('normal');
      }
    } else {
      img.classList.add('normal');
    }
  }
  galleryData.forEach((imgData, idx) => {
    let img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.setAttribute('data-category', imgData.category);
    img.setAttribute('loading', idx < 4 ? 'eager' : 'lazy');
      img.addEventListener('load', () => {
      img.classList.add('loaded');
      if (!isMobile() && imgData.category !== 'lifestyle') {
        assignAspectClass(img);
      } else {
        img.classList.remove('normal', 'wide', 'tall');
        img.classList.add('normal');
      }
      if (isMobile()) img.classList.add('pull-in-top');
    });
    img.addEventListener('error', () => {
      img.classList.add('error');
      if (isMobile()) img.classList.add('pull-in-top');
    });
    img.addEventListener('click', () => openLightbox(imgData, galleryData, idx));
    let wrapper = document.createElement('div');
    wrapper.className = 'img-wrapper';
    wrapper.appendChild(img);
    galleryGrid.appendChild(wrapper);
  });

  // Remove Family tab
  const familyTab = document.querySelector('.tab-button[data-category="family"]');
  if (familyTab) familyTab.remove();

  // Tab filtering
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      tabButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterImages(category);
      });
  });

  function filterImages(category) {
    const isMobileView = isMobile();
    let visible = [];
    
    // Always work with wrappers for consistency
    const items = galleryGrid.querySelectorAll('.img-wrapper');
    items.forEach((item, i) => {
      let img = item.querySelector('img');
      const imgCategory = img.getAttribute('data-category');
      
      if (category === 'all') {
        // Show all images for All Photos tab
        item.style.display = 'block';
      } else if (imgCategory === category) {
        // Show only images matching the selected category
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
      
      if (item.style.display === 'block') visible.push(item);
    });
    
    // Update gallery grid class for lifestyle
    galleryGrid.classList.remove('lifestyle');
    if (category === 'lifestyle') {
      galleryGrid.classList.add('lifestyle');
    }
    
    // Remove all aspect classes first
    visible.forEach(wrapper => {
      let img = wrapper.querySelector('img');
      wrapper.classList.remove('wide');
      img.classList.remove('normal', 'wide', 'tall');
    });
    
    // Updated list of wide images - only specific images should be wide on mobile
    const wideImages = [
      'martin_and_tiger.jpeg',  // wide in events
      'martin_arrival.jpeg',    // wide in events
      'martin_and_sons.jpg',    // wide in other images (for All Photos)
      'martin_with_men.jpg',    // wide in other images (for All Photos)
      'how_it_started.jpeg'     // wide in other images (for All Photos)
    ];
    
    if (category === 'lifestyle') {
      // Lifestyle: always strict grid, all normal
      visible.forEach(wrapper => {
        let img = wrapper.querySelector('img');
        img.classList.add('normal');
      });
    } else {
      if (isMobileView) {
        // Mobile: Only the specified images are wide, all others normal
        visible.forEach(wrapper => {
          let img = wrapper.querySelector('img');
          const src = img.src.split('/').pop();
          if (wideImages.includes(src)) {
            wrapper.classList.add('wide');
            img.classList.add('wide');
          } else {
            img.classList.add('normal');
          }
        });
      } else {
        // Desktop: assign by aspect ratio for non-lifestyle tabs
        visible.forEach(wrapper => {
          let img = wrapper.querySelector('img');
          assignAspectClass(img);
        });
      }
    }
  }

  // Show all images by default
  filterImages('all');

  // Lightbox functionality
  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(imageData, images, index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    currentImages = images;
    currentIndex = index;
    lightboxImg.src = imageData.src;
    lightboxImg.alt = imageData.alt;
    lightboxCaption.textContent = imageData.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    const imageData = currentImages[currentIndex];
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    lightboxImg.src = imageData.src;
    lightboxImg.alt = imageData.alt;
    lightboxCaption.textContent = imageData.alt;
}

  function showPrevImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    const imageData = currentImages[currentIndex];
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    lightboxImg.src = imageData.src;
    lightboxImg.alt = imageData.alt;
    lightboxCaption.textContent = imageData.alt;
  }

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next').addEventListener('click', showNextImage);
  document.getElementById('lightbox-prev').addEventListener('click', showPrevImage);
  document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
  });
  document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;
    switch(e.key) {
      case 'Escape': closeLightbox(); break;
      case 'ArrowRight': showNextImage(); break;
      case 'ArrowLeft': showPrevImage(); break;
    }
  });

  // Responsive: re-filter on resize
  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
      filterImages(activeTab.getAttribute('data-category'));
    }
  });
}); 