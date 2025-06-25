/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find each image set
  const imageDivs = Array.from(carousel.querySelectorAll('.cmp-carousel__container > .pre-load-image'));
  // Find each slide's content panel
  const slidePanels = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));

  // Helper to resolve an img's src to absolute
  function resolveImgSrc(img) {
    if (!img) return null;
    let src = img.getAttribute('src') || '';
    if (src.startsWith('/')) {
      const a = document.createElement('a');
      a.href = src;
      src = a.href;
    }
    img.src = src; // Ensure full src is set
    return img;
  }

  // Collect table rows
  const rows = [['Carousel (carousel5)']];

  for (let i = 0; i < slidePanels.length; i++) {
    // Get corresponding image
    let imgEl = null;
    if (imageDivs[i]) {
      const desktopImg = imageDivs[i].querySelector('.image-desktop');
      if (desktopImg) {
        imgEl = resolveImgSrc(desktopImg);
      }
    }
    // Fallback: if no image found
    if (!imgEl) imgEl = '';

    // Now, build text cell by referencing the appropriate content from the slide
    const cellContents = [];
    // The section containing content can have multiple nested containers. We'll start from the direct child of .cmp-carousel__item that contains .columncontainer or fallback to .cmp-carousel__item itself
    let contentContainer = slidePanels[i].querySelector('.columncontainer, .column-container');
    if (!contentContainer) contentContainer = slidePanels[i];

    // 1. Subtitle above h2 (only if present)
    // Some slides have an h4 above the h2 as a subtitle
    let h4 = contentContainer.querySelector('h4.cmp-title__text, h4'); // .cmp-title__text preferred
    if (h4) {
      // Only add if not also the main title
      cellContents.push(h4);
    }

    // 2. Main title h2 (or h3/h4 if no h2)
    let h2 = contentContainer.querySelector('h2, h3');
    if (h2) {
      cellContents.push(h2);
    }

    // 3. All paragraphs (copy order as in HTML)
    // There may be multiple text sections, so we collect all <p> in subtree
    const pSets = Array.from(contentContainer.querySelectorAll('p'));
    pSets.forEach((p) => cellContents.push(p));

    // 4. CTA button (may be in a .button)
    const btn = contentContainer.querySelector('a.cmp-button');
    if (btn) {
      cellContents.push(btn);
    }

    // If no content is found, use an empty string (avoid empty <div>)
    const textCell = (cellContents.length === 1) ? cellContents[0] : (cellContents.length > 1 ? cellContents : '');

    rows.push([
      imgEl,
      textCell
    ]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
