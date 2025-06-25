/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header
  const headerRow = ['Cards (cards8)'];
  // Find the row container for the cards
  const cardRow = element.querySelector('.card-list__row, .dynamic-list-item-container');
  if (!cardRow) return;
  const cards = Array.from(cardRow.querySelectorAll('article.cmp-card-list__item'));
  const rows = [headerRow];
  cards.forEach(card => {
    // IMAGE CELL
    let imgEl = null;
    // Each card's <a> holds data-background with the image URL
    const anchor = card.querySelector('a.cmp-card');
    if (anchor) {
      const bgUrl = anchor.getAttribute('data-background');
      if (bgUrl) {
        imgEl = document.createElement('img');
        imgEl.src = bgUrl;
        imgEl.alt = '';
        // Set alt if available from aria-label
        const roleImg = anchor.querySelector('[role="img"]');
        if (roleImg && roleImg.getAttribute('aria-label')) {
          imgEl.alt = roleImg.getAttribute('aria-label');
        }
      }
    }
    // TEXT CELL
    // Reference existing nodes for text content if possible
    const textParts = [];
    // Title
    const title = card.querySelector('.cmp-card-content-title');
    if (title) {
      // Use existing node referenced from DOM, but wrap in <strong> for semantic heading
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textParts.push(strong);
    }
    // Description
    const desc = card.querySelector('.cmp-card-content-des');
    if (desc) {
      if (textParts.length > 0) textParts.push(document.createElement('br'));
      // Use existing node referenced from DOM
      textParts.push(desc);
    }
    // CTA
    const cta = card.querySelector('.cmp-card-content-label span');
    if (cta && anchor) {
      if (textParts.length > 0) textParts.push(document.createElement('br'));
      // Make link using existing anchor href and cta text
      const a = document.createElement('a');
      a.href = anchor.href;
      a.textContent = cta.textContent;
      textParts.push(a);
    }
    rows.push([
      imgEl ? imgEl : '',
      textParts.length === 1 ? textParts[0] : textParts,
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
