/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header should match the block name exactly as in the instructions.
  const tableRows = [['Carousel (carousel86)']];

  // 2. Find carousel structure
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;
  
  // 3. Get ordered images for each slide (pre-load-image order matches slides)
  const preLoadImages = cmpCarousel.querySelectorAll('.cmp-carousel__container .pre-load-image');
  // 4. Get all carousel slide content elements
  const slideContents = cmpCarousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // 5. For each slide, extract the image and content
  for (let i = 0; i < slideContents.length; i++) {
    const slide = slideContents[i];

    // 5a. Image: use corresponding pre-load-image by index, prefer image-desktop
    let imgCell = '';
    if (preLoadImages[i]) {
      const img = preLoadImages[i].querySelector('img.image-desktop') || preLoadImages[i].querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // 5b. Text cell: get heading (h3), plus testimonial block if present (class="testimonial")
    const textCell = [];
    const h3 = slide.querySelector('h3');
    if (h3) textCell.push(h3);
    const testimonial = slide.querySelector('.testimonial');
    if (testimonial) textCell.push(testimonial);

    // Only add text cell if content exists, else empty string
    tableRows.push([
      imgCell,
      textCell.length ? textCell : ''
    ]);
  }

  // 6. Replace the original element with the new block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
