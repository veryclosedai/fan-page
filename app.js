document.addEventListener('DOMContentLoaded', async () => {
  const gallery = document.getElementById('gallery');
  
  // Get modal elements
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-image');
  const closeBtn = document.querySelector('.close-btn');
  
  // Define modal functions
  const openModal = (src) => {
    modalImg.src = src;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };

  // Set up modal event listeners
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  try {
    const response = await fetch('photos.json');
    const photos = await response.json();
    // Pass openModal to renderGallery
    renderGallery(photos, openModal);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        while (gallery.firstChild) {
          gallery.removeChild(gallery.firstChild);
        }
        // Pass openModal again when re-rendering
        renderGallery(photos, openModal);
      }, 250);
    });
    
  } catch (error) {
    gallery.innerHTML = '';
  }
});

// Add openModal as a parameter
function renderGallery(photos, openModal) {
  const gallery = document.getElementById('gallery');
  const style = window.getComputedStyle(gallery);
  const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const availableWidth = gallery.clientWidth - horizontalPadding;
  const minRowHeight = 100;
  let currentIndex = 0;

  while (currentIndex < photos.length) {
    const row = [];
    let rowAspectRatioSum = 0;
    let rowHorizontalCount = 0;

    for (let i = currentIndex; i < photos.length; i++) {
      const photo = photos[i];
      const aspectRatio = photo.width / photo.height;
      const isHorizontal = photo.width >= photo.height;

      if (isHorizontal && rowHorizontalCount >= 4) break;

      const newRow = [...row, photo];
      const newRowAspectRatioSum = rowAspectRatioSum + aspectRatio;
      const newRowHorizontalCount = isHorizontal ? rowHorizontalCount + 1 : rowHorizontalCount;
      const gapSpace = 10 * (newRow.length - 1);
      const rowHeight = (availableWidth - gapSpace) / newRowAspectRatioSum;

      if (row.length > 0 && rowHeight < minRowHeight) break;

      row.push(photo);
      rowAspectRatioSum = newRowAspectRatioSum;
      rowHorizontalCount = newRowHorizontalCount;
      currentIndex = i + 1;
    }

    if (row.length === 0) break;

    const gapSpace = 10 * (row.length - 1);
    const rowHeight = Math.max((availableWidth - gapSpace) / rowAspectRatioSum, minRowHeight);

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    row.forEach(photo => {
      const container = document.createElement('div');
      container.className = 'photo-container';
      const aspectRatio = photo.width / photo.height;
      container.style.width = `${aspectRatio * rowHeight}px`;
      container.style.height = `${rowHeight}px`;

      const img = document.createElement('img');
      img.className = 'photo';
      img.src = photo.src;
      img.alt = '';
      img.loading = 'lazy';

      // Use the passed openModal function
      img.addEventListener('click', () => {
        openModal(photo.src);
      });

      container.appendChild(img);
      rowDiv.appendChild(container);
    });

    gallery.appendChild(rowDiv);
  }
}