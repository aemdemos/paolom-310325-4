/* global WebImporter */
export default function parse(element, { document }) {
  // Block name (header)
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  // Get all slides in the carousel
  const carouselItems = element.querySelectorAll('.cmp-carousel__item');
  carouselItems.forEach((item) => {
    // --- IMAGE COLUMN ---
    // Find main image (portrait)
    let img = item.querySelector('.cmp-quote-img img');
    // fallback: any descendant .cmp-img or first img
    if (!img) {
      img = item.querySelector('.cmp-img, img');
    }
    // --- TEXT COLUMN ---
    // Find quote text
    const quoteText = item.querySelector('.cmp-quote-text q');
    // Find byline/title
    const byline = item.querySelector('.cmp-quote-title');
    // Find CTA (button link)
    const cta = item.querySelector('.button .cmp-button');
    // Compose the text cell
    const textCell = [];
    if (quoteText) {
      const p = document.createElement('p');
      p.textContent = quoteText.textContent.trim();
      textCell.push(p);
    }
    if (byline) {
      // The byline may contain a <strong> and a text node after, so preserve markup
      const p = document.createElement('p');
      p.innerHTML = byline.innerHTML.trim();
      textCell.push(p);
    }
    if (cta) {
      textCell.push(cta);
    }
    rows.push([
      img || '',
      textCell.length ? textCell : ''
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
