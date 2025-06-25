/* global WebImporter */
export default function parse(element, { document }) {
  // Get the card list, prefer UL if present
  let cardList = element.querySelector('ul.cmp-bio-card-list__items');
  if (!cardList) {
    // Try to get from carousel fallback
    const carousel = element.querySelector('.cmp-bio-card-list__carousel .swiper-wrapper');
    if (carousel) {
      // Find any li children inside .swiper-slide
      const ul = document.createElement('ul');
      carousel.querySelectorAll('li.cmp-bio-card-list__item').forEach(li => {
        ul.appendChild(li);
      });
      cardList = ul;
    }
  }
  if (!cardList) return;

  const rows = [['Cards (cards43)']];
  cardList.querySelectorAll('li.cmp-bio-card-list__item').forEach(card => {
    // Left column: Image or blank
    let imageCell = '';
    const img = card.querySelector('.cmp-bio-card__image img');
    if (img) imageCell = img;

    // Right column: all text content including link, preserve formatting
    const cellContents = [];
    const content = card.querySelector('.cmp-bio-card__content');
    if (content) {
      // Name as <div> or <strong>, keep as is
      const nodes = Array.from(content.childNodes).filter(n => {
        // Filter out empty text nodes
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        if (n.nodeType === 1) return true;
        return false;
      });
      nodes.forEach(node => {
        // reference existing node directly
        cellContents.push(node);
      });
    }
    rows.push([imageCell, cellContents]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
